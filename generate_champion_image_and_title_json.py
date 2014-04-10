# Creates a JSON file containing the name, title, and local portrait and thumbnail URIs for each champion

import pickle
import json

def getChampionData(name, title):
    championId = name.replace("'", '').replace('.','').replace(' ', '').lower()
    obj = {
        'id': championId,
        'name': name,
        'thumbnail': '/img/thumbnails/' + name + '.png',
        'portrait': '/img/portraits/' + name + '.jpg',
        'title': title
    }
    return obj

with open('data/titles.p', 'rb') as titlesFile:
    championTitles = pickle.load(titlesFile)
    outData = {}
    for name in championTitles:
        outData[name] = getChampionData(name, championTitles[name])
    
outFile = open('data/champs.json', 'wb')
outFile.write(json.dumps(outData))
outFile.close()
