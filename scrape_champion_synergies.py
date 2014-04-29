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
    goodmatchups = {}
    badmatchups = {}
    goodsynergies = {}
    badsynergies = {}
    for i in range(len(categories)):
        characters = categories[i].findAll('dd')
        for j in range(len(characters)):
            val = characters[j].find('div', {'class': 'cpval'})
            nameurl = characters[j].find('a', href=True)['href']
            nameimage = nameurl[11:] 
            name = nameimage[:-5]
            if i == 0:
                goodmatchups[name] = val.contents[0][:5]
            elif i == 1:
                badmatchups[name] = val.contents[0][:5]
            elif i == 2:
                goodsynergies[name] = val.contents[0][:5]
            elif i == 3:
                badsynergies[name] = val.contents[0][:5]

    obj.append(goodmatchups)
    obj.append(badmatchups)
    obj.append(goodsynergies)
    obj.append(badsynergies)

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
        'goodmatchups': data[0],
        'badmatchups': data[1],
        'goodsynergies': data[2],
        'badsynergies': data[3]
    })
inFile.close()
    
outFile = open('data/champion_synergies_and_matchups.json', 'w')
outFile.write(json.dumps(outData))
outFile.close()
