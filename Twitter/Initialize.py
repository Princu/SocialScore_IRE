# IRE  MAJOR Project
# Contributors : Princu Jain & Arihant Gupta

from twitter import *
import urllib2
import sys
import json

def initialize():

	#Setting the proxy settings
        proxy = urllib2.ProxyHandler({'http': 'proxy.iiit.ac.in:8080', 'https': 'proxy.iiit.ac.in:8080'})
	opener = urllib2.build_opener(proxy)
	urllib2.install_opener(opener)
        consumer_key = '6pXh5c7Wb3T69nFCnZS9uQ1no'
        consumer_secret = 'uMVEkajs7neuXkytrQSoVO9PPu3JZfkKPahsnXZIz9lAC9bo7J'
        access_key = '946085484-ZiCKqa1rZHbOc1JaLnxTzbrsvNnwCzfaKvYkq2wE'
        access_secret = 'DnJ3rMUDxOeAIPNxFL10ZoJwcIkYmoodLYxyG6mBMooq0'


	# create twitter API object
	twitter = Twitter(auth =  OAuth(access_key, access_secret, consumer_key, consumer_secret))
	return twitter

