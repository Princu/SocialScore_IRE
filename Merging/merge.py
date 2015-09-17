# IRE  MAJOR Project
# Contributors : Princu Jain & Arihant Gupta

""" 
This code is of n^2 complexity where we check for the uniqueness of the url i.e we check if each url(artifact) of twitter was also shared in fb. Here we will be needing each file of fb and twitter in format ['url' + '\t' + 'score']. All the urls in individual files are already unique
This is O(m+n) method with O(m+n) extra space

"""


facebook=open('facebook_url_scored')
twitter=open('twitter_url_scored')
f_out=open('joint_social_matrix.txt','w')
map_urls={}
for i in facebook.readlines():
	url=i.split('\t')[0].strip()
	map_urls[url]=int(i.split('\t').strip())
for i in twitter.readlines():
	url=i.split('\t')[0].strip()
	if url not in map_urls:
		map_urls[url]=int(i.split('\t').strip())
	else
		map_urls[url]+=int(i.split('\t').strip())
for i in map_urls.keys():
	f_out.write(i+','+map_urls[i])

""" Not mentioning O(n^2) method. You can work it out"""

number_of_clusters=7
for i in range(number_of_clusters):
	file_name="fb_cluster"+str(i)
	file2_name="twitter_cluster"+str(i)
	f=open(file_name)
	t=open(file2_name)
	# implement n^2 algorithm now.
