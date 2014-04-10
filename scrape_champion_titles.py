# Grabs titles for each champion.

import requests
from BeautifulSoup import BeautifulSoup
import pickle

def getChampionData(championUrl):
    baseUrl = 'http://loldb.gameguyz.com'
    html = requests.get(baseUrl + championUrl).text
    soup = BeautifulSoup(html)
    title = soup.find('p', {'class': 'chpInfo'}).text
    return title

inFile = open('data/champion_urls.p', 'rb')
championUrls = pickle.load(inFile)
outData = {}
for name in championUrls:
    outData[name] = getChampionData(championUrls[name])
inFile.close()

with open('data/titles.p', 'w') as outFile:
    pickle.dump(outData, outFile)
