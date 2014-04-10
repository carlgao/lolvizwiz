# Grabs thumbnails and portrait URLs for each champion. 
# Portrait URL exceptions which we had to manually correct in the output data file:
# Dr. Mundo 
# Fiddlesticks
# Kog'Maw
# LeBlanc
# Wukong    

import requests
from BeautifulSoup import BeautifulSoup
import pickle
import json

def getChampionData(name, championUrl):
    baseUrl = 'http://loldb.gameguyz.com'
    html = requests.get(baseUrl + championUrl).text
    soup = BeautifulSoup(html)
    thumbnailUrl = soup.find('img', {'id': 'championId'})['src']
    
    processedName = ''
    decapNext = False
    for char in name:
        if decapNext:
            processedName += char.lower()
        elif char == "'":
            decapNext = True
        elif char != ' ':
            processedName += char
    portraitUrl = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + processedName + '_0.jpg'
    
    obj = {
        'thumbnailUrl': baseUrl + thumbnailUrl,
        'portraitUrl': portraitUrl
    }
    return obj

inFile = open('data/champion_urls.p', 'rb')
championUrls = pickle.load(inFile)
outData = {}
for name in championUrls:
    data = getChampionData(name, championUrls[name])
    outData[name] = {
        'name': name,
        'thumbnail': data['thumbnailUrl'],
        'portrait': data['portraitUrl']
    }
inFile.close()
outFile = open('data/images.json', 'w')
outFile.write(json.dumps(outData))
outFile.close()

