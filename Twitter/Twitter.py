# IRE  MAJOR Project
# Contributors : Princu Jain & Arihant Gupta
# Twitter Data Ranking
# Run : Python <filename> <NumberOfPosts>

from twitter import *
import urllib2
import sys
import json
import time
from Initialize import initialize
# Create a twitter object
twitter = initialize()

# UserNames contains the list of users whose twitter data will be crawled.
UserNames=["YouTube","BarackObama","katyperry","cnnbrk","espn","CNN","SportsCenter","narendramodi","BreakingNews"]

#user-defined weightage
heu={}
heu["retweet"]=10
heu["fav"]=7
heu["followers"]=0.01

#set a limit to how many tweets per person to be extracted.
c = int(sys.argv[1])
if c>200:
    print "Count must be less than 200. You entered: "+ str(c)
    sys.exit()
i=0
for UserName in UserNames:
    print UserName
    #Retrieving Id of first tweet of username for continous extraction of tweets as twitter allows only 200 requests
    user_timeline = twitter.statuses.user_timeline(screen_name=UserName,count=1)
    for tweet in user_timeline:
        lis=[int(tweet['id_str'])]
    for j in range(1,9):
        statuses = twitter.statuses.user_timeline(screen_name = UserName,count = c,max_id=lis[-1])
        for tweets in statuses:
            lis.append(int(tweets['id_str']))
            i=i+1
    	    score = 0
    	    score = heu["retweet"]*tweets['retweet_count']
    	    score += heu["fav"]*int(tweets['favorite_count'])
            score+=tweets['user']['followers_count']*heu["followers"]

            tweet_dic = {}
            tweet_dic['username']=UserName
            tweet_dic['hashtags']=tweets['entities']['hashtags']
            tweet_dic['retweet_count']=tweets['retweet_count']
            tweet_dic['user_follower']= tweets['user']['followers_count']
            tweet_dic['favourite_count']=int(tweets['favorite_count'])
    	    tweet_dic['id_str'] = tweets['id_str']
    	    tweet_dic['score'] = score
    	    tweet_dic['text'] = tweets['text']
    	    media = []
            # FInding URL links in the tweet in expanded form
            try:
                for _media in tweets['entities']['media']:
                    media.append(_media['media_url'])
            except:
                pass
            tweet_dic['media'] = media

    	    url = []
	    try:
                for _url in tweets['entities']['urls']:
                    url.append(_url['expanded_url'])
	    except:
                pass
	    tweet_dic['url'] = url
            #Dumping the data in tweet_dictionary.json file
	    if i==1:
                with open('tweet_dictionary.json', 'a') as outfile:
                    json.dump(tweet_dic, outfile)
                    outfile.write('\n')
	    else:
                with open('tweet_dictionary.json', 'a') as outfile:
                    json.dump(tweet_dic, outfile)
                    outfile.write('\n')
        time.sleep(300)
