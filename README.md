                      Twitter
  
Main libraries used :
-> Twitter API for python
-> Scikit-learn 
   Link : http://scikit-learn.org/stable/modules/classes.html#module-sklearn.cluster
-> Boilerpipe and requests python libraries. requests library is pre-installed.
   Link for Boilerpipe : https://github.com/misja/python-boilerpipe
   Dependencies: jpype, charade

I extracted the Twitter data (using Twitter API) for 9 users, a total of 14000 tweets and dumped them into tweet_dictionary.json. (Using Twitter/Twitter.py)

Then, extracted urls and their corresponding scores and text from tweet_dictionary.json dump file. After extracting, I get destination URL of each of the URL's (artifacts) because many a times there are redirections or shortened URLs. (Twitter/twitter_url_extract.py)

After that, dump them into a file and make sure that each of these URLs is unique. Now I extract URLs from this dump file and get content on the respective pages using boilerpipe library.(witter/extract_data_url.py)


                        Facebook 
 
Graph API was hit directly from a local Node js server and access key required for the call was generated by making an app and creating 60 days access key. Node js server makes it easy to read the document and remove unwanted script tags and take the text content only. All the text content of all the artifacts were dumped into mongoDB for later use. (Use Facebook/* files)


                         Generic
                         
I make sure that textual details of each of the artifact is in a single line as required by our clustering algorithm. (Clustering.py)

Then I wrote merge code for on 3 different algorithms.(Merging.py)

1st that works on O(m+n) complexity and O(m+n) extra space.
2nd works on O(m*n) comlexity and no extra space.
3rd works on O(m*n/no_clusters^2) time complexity.


Youtube Video Link : https://www.youtube.com/watch?v=kFtPyO3ZhHM&feature=youtu.be

