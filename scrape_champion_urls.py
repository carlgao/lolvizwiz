import requests
from BeautifulSoup import BeautifulSoup
import pickle

r = requests.get('http://loldb.gameguyz.com/champions')
soup = BeautifulSoup(r.text)

heroesList = soup.find('ul', 'herosList')

heroUrls = {}
for hero in heroesList.findAll('li'):
    key = hero.find('span', 'heroName').text
    val = hero.find('a')['href']
    heroUrls[key] = val

with open('data/champion_urls.p', 'wb') as outFile:
	pickle.dump(heroUrls, outFile)