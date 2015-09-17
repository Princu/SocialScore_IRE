# IRE  MAJOR Project
# Contributors : Princu Jain & Arihant Gupta
# Extract the URL's from the .json dump created by Twitter.py i.e. tweet_dictionary.json

import json
import requests
import unicodedata
import re
data = []
#loading data from tweet file
with open('tweet_dictionary.json') as data_file:
	for line in data_file:
		data.append(json.loads(line))

f=open("url_score.txt","w")
f2=open("url_text.txt","w")
#creating dictionaries to include uniqueness. This can be modified for better scalability. 
url_score_dic={}
url_text_dic={}
count=0
for i in range(len(data)):
	u = (data[i]['url'])
	for j in u: #Iterating through the list of urls for that particular tweet. This list can be empty too.
		try:
			j=unicodedata.normalize('NFKD',j).encode('ascii','ignore') #Converting url to string from unicode.
			url=requests.get(j).url  #finding destination URL since URL maybe shortned URL too.
			score=data[i]['score']
			text=data[i]['text']
			text=re.sub(r'\w+:\/{2}[\d\w-]+(\.[\d\w-]+)*(?:(?:\/[^\s/]*))*', '',text) #Removing URLS from the text using regular expressions.
			if url != "" and url not in url_score_dic:
				url_score_dic[url]=score
				count+=1
				url_text_dic[url]=text
			else:
				url_text_dic[url]+=score
				url_text_dic[url]+=" "+text
		except:
			continue
	if count%100==0 and count:
		print count

print count,len(data)
for i in sorted(url_score_dic.keys()):
	try:
		#Writing two separate parallel files containing URL vs Tweet-Text and URL vs Score.
		string = str(i)+'\t'+str(url_score_dic[i])+'\n' 
		string2= str(i)+'\t'+str(url_text_dic[i])+'\n'
		f.write(string)
		f2.write(string2)
	except:
		continue
