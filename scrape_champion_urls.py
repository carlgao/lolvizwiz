import requests
from BeautifulSoup import BeautifulSoup
import pickle

import csv

with open('sample.txt','rb') as tsvin, open('new.csv', 'wb') as csvout:
    tsvin = csv.reader(tsvin, delimiter='\t')
    csvout = csv.writer(csvout)

    for row in tsvin:
        count = int(row[4])
        if count > 0:
            csvout.writerows([row[2:4] for _ in xrange(count)])

            

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