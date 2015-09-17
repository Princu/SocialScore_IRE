# IRE  MAJOR Project
# Contributors : Princu Jain & Arihant Gupta
#Clustering

"""	  Input Format : Make a single file where each line represents a whole doument
	  file name : url_text.txt & url_score.txt

	  Output Format: Type the file name <filename> after executing, then according to no. of clusters=n, n  text files with name <filename1>,<filename2>,.....<filenamen> will be created  
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import *

# url_text.txt contains the text as described above while url_score.txt contains url corresponding to that test
fileptr  = open('url_text.txt','r')
documents = fileptr.readlines()
n=8
f_ptrs=[0]*n
f_name=raw_input()
fileptr.close()
f=open('url_score.txt')
urls = f.readlines()

#Create a vector of each document in the text file(every line is a document) with term frequency(tf) and inverted document frequency(idf) as its features for every word in that doucment   +   Remove the stopwords
vectorizer = TfidfVectorizer(stop_words = 'english')

#Convert all the vectors to a vector model (m*n matrix where m is the no. of distinct words in the whole text file(i.e. all documents and n is the number of documents)
vector_model = vectorizer.fit_transform(documents)

""" 	All three methods were tested and accordingly used 	Currenty: MinBatchKmeans is used"""

#Spectral Clustering with tolerance i.e. stopping criterion  of eigendecomposition of Laplacian matrix
cluster_model = SpectralClustering(n_clusters=n, eigen_solver='arpack',eigen_tol=0.01)


#MiniBatch K-Means Clustering with max_iter defining max. no iterations
cluster_model2 = MiniBatchKMeans(n_clusters=n,max_iter=400,max_no_improvement=20)

#Normal K-means Clustering with n_init defining number of times algorithm runs with new sets of intial points and n_jobs defining parallel computation
kmeans_model = KMeans(n_clusters=n,max_iter=100,n_init=20,n_jobs=-1)

# model.fit_predict returns the cluster number in an array in the same order as were the documents in the text file
Spectral_y = cluster_model.fit_predict(vector_model)
MiniBatchKmean_y = cluster_model2.fit_predict(vector_model)
PureKmeans_y = kmeans_model.fit_predict(vector_model)

print MiniBatchKmean_y
print PureKmeans_y
print Spectral_y

if len(MiniBatchKmean_y)!=len(urls):
	print "error"
else:
        for i in range(n):
            name=f_name+str(i)
            f_ptrs[i]=open(name,"w")
	for i in range(len(urls)):
	    f_ptrs[MiniBatchKmean_y[i]].write(urls[i])

