import logging

import azure.functions as func
import requests

def main(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")
    blobcontents = myblob.read().decode('utf-8')
    if "ERROR:" in blobcontents:
        logging.info("Error Found")
    else:
        logging.info("No error found")

    requests.post('https://5b4795e8-9e6c-4f88-a5d2-4b5e909ef4d8.webhook.eus.azure-automation.net/webhooks?token=7DM%2fQns2niHI%2bspvt4d1daVAHvloLfYx1fQLIFZ4Qx0%3d')