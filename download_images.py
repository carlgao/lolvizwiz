# Downloads thumbnails and portraits for each champion.

import shutil
import requests
import json

def downloadImages(imageData):
    response = requests.get(imageData['thumbnail'], stream=True)
    with open('img/thumbnails/' + imageData['name'] + '.png', 'wb') as outFile:
        shutil.copyfileobj(response.raw, outFile)
    del response
    
    response = requests.get(imageData['portrait'], stream=True)
    with open('img/portraits/' + imageData['name'] + '.jpg', 'wb') as outFile:
        shutil.copyfileobj(response.raw, outFile)
    del response

with open('data/images.json', 'rb') as inFile:
    imageData = json.loads(inFile.read())
    outData = {}
    for name in imageData:
        downloadImages(imageData[name])
