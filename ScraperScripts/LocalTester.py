
from os import error, remove
import tarfile
import xml.etree.ElementTree as ET
import requests
import io
from azure.cosmos import exceptions, CosmosClient, PartitionKey
from datetime import date, datetime, timedelta
import time
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
import traceback

crawlHelper = "index.json"
feedURL = "https://www.sec.gov/Archives/edgar/Feed/"
oldestDateAllowed = date.today() - timedelta(days=30)
insiderData = {}

filepathprefix = "C:/Users/brody/Downloads/"

filename = str(date.today()) + "_ScraperLogs.txt"
filepath = filepathprefix + filename
logFile = open(filepath,"w")
logFile.write("Beginning scraper script\n")



def parseInsiderFilings():
    tar = ''
 
    tar = tarfile.open("C:/Users/brody/Downloads/20210608.nc.tar.gz")

    for filingFile in tar.getnames():
        try:
            if filingFile[-3:] == '.nc':
                logFile.write('extracting and reading from file ' + filingFile + "\n")
                filingReader = tar.extractfile(filingFile)
                filingContent = filingReader.read().decode('utf-8')
                formTypeIndex = filingContent.find('<FORM-TYPE>')
                
                if not (filingContent[formTypeIndex + 11] == "4" and filingContent[formTypeIndex + 12] == "\n"):
                    logFile.write('\tContinuing - not a Form4 Filing\n')
                    continue

                # parse file to remove non-xml content
                startString = "<?xml"
                endString = "</ownershipDocument>"
                startIndex = filingContent.find(startString)
                endIndex = filingContent.find(endString) + len(endString)
                filingXMLString = filingContent[startIndex:endIndex]

                # convert content to XML object
                filingXML = ET.ElementTree(ET.fromstring(filingXMLString))
                filingXML = filingXML.getroot()

                # Get the company symbol and name
                issuerXML = filingXML.find("issuer")
                symbol = issuerXML.find("issuerTradingSymbol").text.upper()
                issuerCIK = issuerXML.find("issuerCik").text
                companyName = issuerXML.find("issuerName").text

                # Get the reporting owner name and company titles assigned to the reporting owner
                reportingOwnerName = ""
                reportingOwnerCIK = ""
                if filingXML.find("reportingOwner").find("reportingOwnerId").find("rptOwnerName") is not None:
                    reportingOwnerName = filingXML.find("reportingOwner").find("reportingOwnerId").find("rptOwnerName").text
                
                if filingXML.find("reportingOwner").find("reportingOwnerId").find("rptOwnerCik") is not None:
                    reportingOwnerCIK = filingXML.find("reportingOwner").find("reportingOwnerId").find("rptOwnerCik").text

                reportingOwnerTitlesXML = filingXML.find("reportingOwner").find("reportingOwnerRelationship")
                reportingOwnerTitles = []
                if reportingOwnerTitlesXML.find("isOfficer") is not None and reportingOwnerTitlesXML.find("isOfficer").text in ("1", "true", "TRUE", "True"):
                    reportingOwnerTitles.append(reportingOwnerTitlesXML.find("officerTitle").text)
                if reportingOwnerTitlesXML.find("isDirector") is not None and reportingOwnerTitlesXML.find("isDirector").text in ("1", "true", "TRUE", "True"):
                    reportingOwnerTitles.append("Director")
                if reportingOwnerTitlesXML.find("isTenPercentOwner") is not None and reportingOwnerTitlesXML.find("isTenPercentOwner").text in ("1", "true", "TRUE", "True"):
                    reportingOwnerTitles.append("10% Owner")
                if reportingOwnerTitlesXML.find("isOther") is not None and reportingOwnerTitlesXML.find("isOther").text in ("1", "true", "TRUE", "True"):
                    reportingOwnerTitles.append(reportingOwnerTitlesXML.find("otherText").text)
                
                if filingXML.find("nonDerivativeTable") is None or filingXML.find("nonDerivativeTable").find("nonDerivativeTransaction") is None:
                    continue
                
                tradeDataXML = filingXML.find("nonDerivativeTable").findall("nonDerivativeTransaction")

                traderDataJSON = {
                    'Reporting Owner Name': reportingOwnerName,
                    'Reporting Owner CIK': reportingOwnerCIK,
                    'Reporting Owner Titles': reportingOwnerTitles,
                    'Total shares purchased' : 0,
                    'Total value purchased' : 0,
                    'Number of trades': 0,
                    'Trades' : []
                }

                for tradeEntryXML in tradeDataXML:
                    if tradeEntryXML is None or tradeEntryXML.find("transactionCoding") is None or tradeEntryXML.find("transactionCoding").find("transactionCode") is None or tradeEntryXML.find("transactionCoding").find("transactionCode").text != "P":
                        logFile.write("\tContinuing - transaction coding non-existing or not of type P (direct purchase)\n")
                        continue

                    transactionDate = tradeEntryXML.find("transactionDate").find("value").text[:10]

                    date_Obj = datetime.strptime(transactionDate, '%Y-%m-%d').date()
                    if date_Obj < oldestDateAllowed:
                        logFile.write("\tContinuing - transaction date reported is older than allowed by the data retainment rules\n")
                        continue

                    # e.g. Common Stock
                    securityTitle = tradeEntryXML.find("securityTitle").find("value").text

                    # e.g. Form4
                    transactionFormType = tradeEntryXML.find("transactionCoding").find("transactionFormType").text

                    # e.g. P or S
                    transactionCode = tradeEntryXML.find("transactionCoding").find("transactionCode").text

                    numberOfShares = float(tradeEntryXML.find("transactionAmounts").find("transactionShares").find("value").text.replace(',',''))
                    sharePrice = round(float(tradeEntryXML.find("transactionAmounts").find("transactionPricePerShare").find("value").text.replace(',','')),2)

                    # e.g. D or I (direct or indirect)
                    ownershipNature = tradeEntryXML.find("ownershipNature").find("directOrIndirectOwnership").find("value").text
                    if ownershipNature != "D":
                        logFile.write("\tContinuing - ownership nature is not D (direct ownership)\n")
                        continue

                    sharesOwnedPostTransaction = tradeEntryXML.find("postTransactionAmounts").find("sharesOwnedFollowingTransaction").find("value").text

                    tradeDataJSON = {
                        'Security Title': securityTitle,
                        'Transaction Date': transactionDate,
                        'Transaction Form Type': transactionFormType,
                        'Transaction Code': transactionCode,
                        'Number of shares': numberOfShares,
                        'Share Price': sharePrice,
                        'Ownership Nature': ownershipNature,
                        'Shares Owned Post-Transaction': sharesOwnedPostTransaction,
                        'File Source': filingFile
                    }
                    traderDataJSON['Total shares purchased'] += numberOfShares
                    traderDataJSON['Total value purchased'] += numberOfShares * sharePrice
                    traderDataJSON['Trades'].append(tradeDataJSON)
                    traderDataJSON['Number of trades'] = len(traderDataJSON['Trades'])

                    if symbol not in insiderData:
                        companyData = {
                            'Symbol': symbol,
                            'Issuer Name': companyName,
                            'Issuer CIK' : issuerCIK,
                            'Trader Data' : [],
                            'Total shares purchased': 0,
                            'Total value purchased': 0,
                            'Total insider buyers': 0,
                            'Total buys': 0
                        }
                        insiderData[symbol] = companyData
                if traderDataJSON['Number of trades'] > 0 and symbol in insiderData:
                    insiderData[symbol]['Trader Data'].append(traderDataJSON)
                    insiderData[symbol]['Total shares purchased'] = 0
                    insiderData[symbol]['Total value purchased'] = 0
                    insiderData[symbol]['Total insider buyers'] = len(insiderData[symbol]['Trader Data'])
                    insiderData[symbol]['Total buys'] = 0

                    for trade in insiderData[symbol]['Trader Data']:
                        insiderData[symbol]['Total shares purchased'] += trade['Total shares purchased']
                        insiderData[symbol]['Total value purchased'] += trade['Total value purchased']
                        insiderData[symbol]['Total buys'] += trade['Number of trades']
        except Exception as e:
            logError()


def manageAndUploadData():
    try:
        client = CosmosClient("insert_conn_str_here", "insert_key_here==")
        database = client.get_database_client('insiderdb')
        container = database.get_container_client('insiderdata')
        existingItems = container.read_all_items()

        symbolsToAdd = str(insiderData.keys())

        for existingItem in existingItems:
            updatedItem = existingItem.copy()
            
            # Loop through existing trade entries, identify entries with transaction dates older than 3 weeks, and mark those entries for deletion
            toRemove = {}
            #TODO - UPDATE THIS ONCE VERIFYING THAT DUPLICATE SYMBOL ENTRIES ARE NOT ENTERED WHEN ATTEMPTING TO UPDATE. IF SO, USE REPLACE_ITEM INSTEAD OF UPSERT
            index1 = 0
            for traderDataEntry in updatedItem['Trader Data']:
                index2 = 0
                for tradeDataEntry in traderDataEntry['Trades']:
                    trans_Date = tradeDataEntry['Transaction Date']
                    date_Obj = datetime.strptime(trans_Date, '%Y-%m-%d').date()
                    if date_Obj < oldestDateAllowed:
                        if index1 in toRemove:
                            toRemove[index1].append(index2)
                        else:
                            toRemove[index1] = [index2]
                    index2 += 1
                index1 += 1
            
            # Remove each index specified to be removed from Trader Data and updated the overall symbol purchase metrics
            if len(toRemove) > 0:
                for i in sorted(toRemove, reverse=True):
                    toRemove[i].sort(reverse=True)
                    for j in toRemove[i]:
                        sharesPurchased = float(updatedItem['Trader Data'][i]['Trades'][j]['Number of shares'])
                        sharePrice = round(float(updatedItem['Trader Data'][i]['Trades'][j]['Share Price']),2)
                        totalValue = sharesPurchased * sharePrice

                        updatedItem['Trader Data'][i]['Number of trades'] -= 1
                        updatedItem['Trader Data'][i]['Total shares purchased'] -= sharesPurchased
                        updatedItem['Trader Data'][i]['Total value purchased'] -= totalValue
                        updatedItem['Total shares purchased'] -= sharesPurchased
                        updatedItem['Total value purchased'] -= totalValue
                        updatedItem['Total buys'] -= 1
                        updatedItem['Trader Data'][i]['Trades'].pop(j)
                    if len(updatedItem['Trader Data'][i]['Trades']) == 0:
                       updatedItem['Trader Data'].pop(i)
                       updatedItem['Total insider buyers'] -= 1



            # Merge new data for the symbol if found in insiderData and remove from insiderData
            if updatedItem['Symbol'] in insiderData:

                for traderData in insiderData[updatedItem['Symbol']]['Trader Data']:
                    insiderCIK = traderData['Reporting Owner CIK']
                    found = False
                    index = 0
                    for updatedItemTraderData in updatedItem['Trader Data']:
                        if updatedItemTraderData['Reporting Owner CIK'] == insiderCIK:
                            found = True
                            break
                        else:
                            index += 1
                    
                    if found: #Trader already has transactions, need to merge
                        updatedItem['Trader Data'][index]['Trades'] += traderData['Trades']
                        updatedItem['Trader Data'][index]['Total shares purchased'] += traderData['Total shares purchased']
                        updatedItem['Trader Data'][index]['Total value purchased'] += traderData['Total value purchased']
                        updatedItem['Trader Data'][index]['Number of trades'] += traderData['Number of trades']
                    else: #New trader data
                        updatedItem['Trader Data'].append(traderData)
                        updatedItem['Total insider buyers'] += 1
                    updatedItem['Total shares purchased'] += traderData['Total shares purchased']
                    updatedItem['Total value purchased'] += traderData['Total value purchased']
                    updatedItem['Total buys'] += traderData['Number of trades']


                currentSymbol = updatedItem['Symbol']
                insiderData.pop(currentSymbol)
            
        #     # If no trade data remains, delete from the database
        #     if len(updatedItem['Trader Data']) == 0:
        #         container.delete_item(updatedItem["id"], updatedItem['Symbol'])
        #         continue
            
        #     container.upsert_item(updatedItem)

        # # Insert the new symbols' data into the database
        # for remainingNewInsiderData in insiderData:
        #     container.upsert_item(insiderData[remainingNewInsiderData])

        logFile.write("\n\nAdded insider data for the following symbols: " + symbolsToAdd + "\n")
    
    except Exception as e:
        logError(False)

def uploadLogs():
    try:
        logFile.close()
        blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName=insiderscraperstorage;AccountKey=ywR/DK+TkNO/oCRCut9+WGshgfe9xkPm8KomJ1chYUeWgsKefy5bRFbjRV3ByVgx79SqZlsfcpsGTNhCiUIBFg==;EndpointSuffix=core.windows.net")
        blob_client = blob_service_client.get_blob_client(container="insiderscraperlogs", blob=filename)
        with open(filepath, "rb") as data:
            blob_client.upload_blob(data)
        remove(filepath)
    except Exception as e:
        logError()

def logError(upload = False):
    logFile.write("ERROR: " + traceback.format_exc())
    if upload:
        uploadLogs()


#r = scrapeInsiderData()
parseInsiderFilings()
manageAndUploadData()
#uploadLogs()