import requests
from BeautifulSoup import BeautifulSoup
import pickle

r = requests.get("http://loldb.gameguyz.com/champions")
soup = BeautifulSoup(r.text)

heroesList = soup.find('ul', "herosList")
print heroesList

hero_urls = []
for hero in heroesList.findAll('li'):
    hero_urls.append(hero.find('a')['href'])
print (hero_urls)

outfile = open("champion_urls.p", "wb")
pickle.dump(hero_urls, outfile)
outfile.close()
