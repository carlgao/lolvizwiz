import requests
from BeautifulSoup import BeautifulSoup
import pickle
import json

def getChampionData(championUrl):
    html = requests.get('http://loldb.gameguyz.com' + championUrl).text
    soup = BeautifulSoup(html)
    synergies = soup.find('div', {'class': 'heroLostBox heroLost'})
    categories = synergies.findAll('dl')
    obj = []
    matchups = {}
    synergies = {}
    for i in range(len(categories)):
        characters = categories[i].findAll('dd')
        for j in range(len(characters)):
            val = characters[j].find('div', {'class': 'cpval'})
            nameurl = characters[j].find('a', href=True)['href']
            nameimage = nameurl[11:] 
            name = nameimage[:-5]
            if i == 0 or i == 1:
                matchups[name] = val.contents[0][:5]
            elif i == 2 or i == 3:
                synergies[name] = val.contents[0][:5]
    obj.append(matchups)
    obj.append(synergies)

    # string = html[i1:i2+1]
    # string = fixLazyJsonWithComments(string)
    # obj = json.loads(string)
    return obj

inFile = open('data/champion_urls.p', 'rb')
championUrls = pickle.load(inFile)

outData = {}
for name in championUrls:
    data = getChampionData(championUrls[name])
    outData[name] = []
    outData[name].append({
        'matchups': data[0],
        'synergies': data[1]
    })
inFile.close()
    
outFile = open('data/champion_synergies_and_matchups.json', 'w')
outFile.write(json.dumps(outData))
outFile.close()
