import requests
import pickle
import json
import re
import tokenize
import token
import StringIO

# Function from http://stackoverflow.com/questions/4033633/handling-lazy-json-in-python-expecting-property-name
def fixLazyJsonWithComments(in_text):
  result = []
  tokengen = tokenize.generate_tokens(StringIO.StringIO(in_text).readline)

  sline_comment = False
  mline_comment = False
  last_token = ''

  for tokid, tokval, _, _, _ in tokengen:

    # ignore single line and multi line comments
    if sline_comment:
      if (tokid == token.NEWLINE) or (tokid == tokenize.NL):
        sline_comment = False
      continue

    # ignore multi line comments
    if mline_comment:
      if (last_token == '*') and (tokval == '/'):
        mline_comment = False
      last_token = tokval
      continue

    # fix unquoted strings
    if (tokid == token.NAME):
      if tokval not in ['true', 'false', 'null', '-Infinity', 'Infinity', 'NaN']:
        tokid = token.STRING
        tokval = u'"%s"' % tokval

    # fix single-quoted strings
    elif (tokid == token.STRING):
      if tokval.startswith ("'"):
        tokval = u'"%s"' % tokval[1:-1].replace ('"', '\\"')

    # remove invalid commas
    elif (tokid == token.OP) and ((tokval == '}') or (tokval == ']')):
      if (len(result) > 0) and (result[-1][1] == ','):
        result.pop()

    # detect single-line comments
    elif tokval == "//":
      sline_comment = True
      continue

    # detect multiline comments
    elif (last_token == '/') and (tokval == '*'):
      result.pop() # remove previous token
      mline_comment = True
      continue

    result.append((tokid, tokval))
    last_token = tokval

  return tokenize.untokenize(result)

def getChampionData(championUrl):
    html = requests.get('http://loldb.gameguyz.com' + championUrl).text
    index = html.find('var popularyChart')
    i1 = html.find('{', index)
    i2 = html.find('}', i1)
    string = html[i1:i2+1]
    string = fixLazyJsonWithComments(string)
    obj = json.loads(string)
    return obj

inFile = open('data/champion_urls.p', 'rb')
championUrls = pickle.load(inFile)

outData = {}
for name in championUrls:
    data = getChampionData(championUrls[name])
    outData[name] = []
    for i in range(len(data['xLabel'])):
        outData[name].append({
            'date': data['xLabel'][i],
            'total': data['total'][i],
            'picked': data['picked'][i],
            'percent': data['data'][i]
        })
inFile.close()
    
outFile = open('data/pick_rates.json', 'w')
outFile.write(json.dumps(outData))
outFile.close()
