/* 
    IRE  MAJOR Project
    Contributors : Princu Jain, Veerendre Bidare, Arihant Gupta
*/
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var htmlToText = require('html-to-text');
var httpOptions = {
    hostname: 'proxy.iiit.ac.in',
    port: 8080,
    path: '',
    method: 'GET'
};
var insertedCount = 0
var mainOptions = httpOptions;
var errorLogStream = fs.createWriteStream('/home/veerendra/WebstormProjects/IRE/apt-test/logs/error.log', {flags: 'a'});
var channels = ["DiscoveryNews"];//,"HuffPostUK","MSNNews","WFLANewsChannel8","WellNYT","abcnews","bbcearth","bbcnews","bbcworldnews",
//"msnbc","mtvnews","nbcnews","news24","newsbusters","nytimes","skynews","yahoonews"];
var channelSchema = [];
var processPost = function(post,next_link){
    if(post != undefined && post.link != undefined){
        if((post.type == "link" || post.type == "video" || post.type == "photo") && !(post.link.lastIndexOf("https://www.facebook.com", 0) === 0)) {
            console.log("Processing post : "+post.id);
            var myobject = {
                _id: post.id,
                message: post.message,
                link: post.link,
                type: post.type,
                //shares_count: share_count,
                //likes_count: likes_count,
                //comments_count: comments_count,
                from: post.from,
                picture: post.picture,
                icon: post.icon,
                status_type: post.status_type,
                next_page: next_link,
                created_time: post.created_time,
                updated_time: post.updated_time,
                localCreatedAt : new Date(),
                localUpdatedAt : new Date()
                //http_status: res.statusCode
            };
            conn.collection('FoxNews').insert(myobject);
        }
    }
};

function processPage(options, postsCount){
    if(postsCount < 2000 && options.path != undefined) {
        var data = "";
        var req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function (chunk) {
                var dataObject = JSON.parse(data);
                var dataLength = 0;
                var next_link = undefined;
                if(dataObject != undefined && dataObject.data != undefined){
                    dataLength = dataObject.data.length;
                }
                if(dataObject != undefined && dataObject.paging != undefined){
                    next_link = dataObject.paging.next;
                }
                var i;

                for (i = 0; i < dataLength; i++) {
                    processPost(dataObject.data[i],next_link);
                }
                if(dataObject.paging == undefined){
                    mainOptions.path = undefined;
                }else{
                    mainOptions.path = next_link;
                }
                processPage(mainOptions, postsCount + 75);
                console.log("Done with a batch : ");
            });
        });
        req.end();
        req.on('error', function (e) {
            var date = new Date();
            errorLogStream.write(date + '\n' + err.stack + '\n\n');

            console.error(e);
        });
    }
}

function processChannels(channelIndex){
    //mainOptions.path = 'https://graph.facebook.com/v2.3/5550296508/posts?limit=75&__paging_token=enc_AdDmg7JYTNaG8MM97tFVx4gOyZCsOvOiaV39z8ADNYTXoEFp6WPvvLww3xEWWpZCUITxct9ULd3WqYH02AThgpX62w&access_token=CAAFn9JzPW2ABABPmfXAQXGEJPYCTh2VY9f2vK1JhNySQbtpHOAE8GkEeygpjmhpsO5KTHKk6ZBdnRPpLh1vZBGf5xZC50LWa3NxjapZCOSXIbmdu10Pq20KkXx8qbLiBZCCGMVsksZAdBmorhgn46rZC40pX91lgOL99Gcq4yCDVaFqU98tOwvOw6zdNZAPrKKDcbqQalpPZCnJnBr53yJS0E&until=1314842303';
    mainOptions.path = 'https://graph.facebook.com/v2.3/' + channels[channelIndex] + '/posts?limit=75&access_token=' + access_token;
    processPage(mainOptions,75);
}

function linkify(text) {
    var urlRegex =/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/g;
    return text.match(urlRegex);
}

function getTextAndInsert(obj,link,collectionName){
    var localOptions = httpOptions;
    localOptions.path = link;
    var localReq = http.request(localOptions, function (res) {
        var localData = "";
        res.on('data', function (chunk) {
            localData += chunk;
        });
        res.on('end', function (chunk) {
            var text = htmlToText.fromString(localData, {
                wordwrap: 130
            });
            if(text != undefined && text.trim() != ""){
                //console.log(text);
                insert(obj, text, res.statusCode,collectionName);
                console.log("Inserted : "+obj._id);
            }
        });
    });
    localReq.end();localReq.on('error', function (e) {console.error(e); });
}
//Get the content of the link
function getLinkData(obj,collection){
    var content = "";
    var options = httpOptions;
    options.path = obj.link;
    options.followAllRedirects = true;

    var req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function (chunk) {
            var text = htmlToText.fromString(content, {
                wordwrap: 130
            });
            if(res.statusCode == 301){
                var links = linkify(text);
                if(Array.isArray(links)){
                    getTextAndInsert(obj,links[0],collection);
                }else{
                    getTextAndInsert(obj,links,collection);
                }

            }else {
                if(text != undefined && text.trim() != ""){
                    insert(obj, text, res.statusCode,collection);
                    console.log("Inserted : "+obj._id);
                }
            }
        });
    });
    req.end();req.on('error', function (e) {console.error(e); });
}

function insert(obj,text,http_status,collection){
    console.log(text.length);
    Text.create({
        _id: obj.id,
        link:obj.link,
        sharesCount: obj.shares_count,
        likesCount:obj.likes_count,
        commentsCount : obj.comments_count,
        collectionName : collection,
        text : text,
        httpStatus : http_status,
        createdAt : new Date(),
        updatedAt : new Date()
    });
    insertedCount++;
    console.log("Count : "+insertedCount);
}

/* POST home page. */
router.get('/', function(request, res, next) {
    processChannels(5);
    res.json({status : "script started"});
});

/* GET request to test*/
router.get('/test', function(request, res, next) {
    var i;
    var dummy;

    //for(i = 0; i < channels.length; i++){
        if(mongoose.model.DiscoveryNews){
            dummy = mongoose.model.DiscoveryNews;
        }else{
            dummy = mongoose.model('yahoonews', mySchema);
        }
        //console.log(dummy);
        dummy.find({}, function(err, documents){
            if(err){
                console.log(err);
            }else{
                var j;
                console.log(documents.length);
                for(j = 0; j < documents.length; j++){
                    getLinkData(documents[j],channels[i]);
                }
                console.log("Done");
            }
        });
});

module.exports = router;
