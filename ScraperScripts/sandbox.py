
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
import json

# client = CosmosClient("insert_conn_str_here", "insert_key_here==")
# database = client.get_database_client('insiderdb')
# container = database.get_container_client('insiderdata')
# existingItems = container.read_all_items()

# data = []
# file = open('C:/Workspaces/InsiderScraper/Scraper-Web-App/src/assets/jsonData.json.', 'w')
# for item in existingItems:
#     data.append(item)

# json.dump(data, file, indent=3)
# file.close()


# file = open('C:/Workspaces/InsiderScraper/Scraper-Web-App/src/app/data/jsonData.json', 'r')
# test = json.load(file)
# print(test[4])


h = {
    'User-Agent': 'InsiderScraper contact@insiderscraper.com',
    'Accept-Encoding': 'gzip',
    'Host': 'www.sec.gov'
}

g = requests.get('https://www.sec.gov/Archives/edgar/Feed/2021/QTR2/20210609.nc.tar.gz', headers=h)
print(g.status_code)