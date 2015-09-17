/* IRE  MAJOR Project
 Contributors : Princu Jain, Veerendra Bidare, Arihant Gupta */

var express = require('express');
var router = express.Router();
var http = require('http');//require('follow-redirects').http;
//var htmlToText = require('html-to-text');
var access_token = 'CAACEdEose0cBAGrMNkK1fnkU56ZB9WpDznVhvPc8ayf8UBZAHqxDZAE8OFcyQx5JXftHw01ib5bJrpqFiyQkFtCUqufVaeG53rQtLpyLUngeXuab85KyBzy5kOQx72DoyVZAfL49qXxRkZAGNdhdrzyfVe0tqAqZAZBLMoIuTOp6sZBZCeKwCMqGFp109vZBCTZC8pfJhc6nWaTVRZCsqmjjZANPBBWZBW7328g2kZD';
//var access_token = 'CAADdCr9R7Q0BANkW2IVuYNpNs1nKSQgJJXQ0fUSXzFDsIVtTbSTsm76HqZASOWvUY1lziQsdslYJZBBUfEhROqUcZAivnslMoGja6a52R8ZCXmRfmYZBOPuodb24WvyPYp42yYFcJSmxMXhWaeOTtDhGttZCDSufJXgE7QRZC7Km2ZAuvyxBt6ogjwZC99U20O6ZBnD2lNnFZCuDSu0PIXPQz0u';
var channels = ["MSN.News","ESPN","cnn","TED","Discovery","FoxNews","HuffingtonPost","HuffPostUK"];
var done = ["WellNYT","WFLANewsChannel8","bbcearth","bbcworldnews","msnbc","nytimes","skynews","bbcnews","DiscoveryNews"];
var httpOptions = {
    hostname: 'proxy.iiit.ac.in',
    port: 8080,
    path: '',
    method: 'GET'
};
var mainOptions = httpOptions;
var fs = require('fs');
var errorLogStream = fs.createWriteStream('/home/veerendra/WebstormProjects/IRE/apt-test/logs/error.log', {flags: 'a'});

function linkify(text) {
    var urlRegex =/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/g;
    return text.match(urlRegex);
}

var processPost = function(post,next_link){
    if(post != undefined && post.link != undefined){
        if((post.type == "link" || post.type == "video" || post.type == "photo") && !(post.link.lastIndexOf("https://www.facebook.com", 0) === 0)) {
            console.log("Processing post : "+post.id);
            var localData = "";
            var options = httpOptions;
            options.path = 'https://graph.facebook.com/v2.3/' + post.id + '/likes?summary=true&access_token=' + access_token;

            var req = http.request(options, function (res) {
                res.on('data', function (chunk) {
                    localData += chunk;
                });

                res.on('end', function (chunk) {
                    var local = JSON.parse(localData);
                    var likes_count = 0;
                    if(local != undefined && local.summary != undefined){
                        likes_count = local.summary.total_count;
                    }
                    processComment(post,likes_count,next_link);
                });
            });
            req.end();req.on('error', function (e) {console.error(e); var date = new Date();
                errorLogStream.write(date+ '\n'+ err.stack+'\n\n');});
        }
    }
};

function processComment(post,likes_count,next_link){
    var commentData = "";
    var options = httpOptions;
    options.path = 'https://graph.facebook.com/v2.3/' + post.id + '/comments?summary=true&access_token=' + access_token;

    var req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            commentData += chunk;
        });

        res.on('end', function (chunk) {
            console.log("Fetching comments and adding to mongo");
            var comments_count = 0;
            var local = JSON.parse(commentData);
            if(local != undefined && local.summary != undefined){
                comments_count = local.summary.total_count;
            }
            if(post.shares == undefined){
                share_count = 0;
            }else{
                share_count = post.shares.count;
            }
            myobject = {
                _id: post.id,
                message: post.message,
                link: post.link,
                type: post.type,
                shares_count: share_count,
                likes_count: likes_count,
                comments_count: comments_count,
                from: post.from,
                picture: post.picture,
                icon: post.icon,
                status_type: post.status_type,
                next_page: next_link,
                created_time: post.created_time,
                updated_time: post.updated_time,
                localCreatedAt : new Date(),
                localUpdatedAt : new Date(),
                http_status: res.statusCode
            };
            conn.collection('MSNNews').insert(myobject);
        });
    });
    req.end();req.on('error', function (e) {console.error(e); var date = new Date();
        errorLogStream.write(date+ '\n'+ err.stack+'\n\n');});
}

function getLinkData(crawlLink){
    //Get the content of the link
    var content = "";
    var options = httpOptions;
    options.path = crawlLink;

    var req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function (chunk) {
            console.log("statusCode: ", res.statusCode);
            var text = htmlToText.fromString(content, {
                wordwrap: 130
            });
            if(res.statusCode == 301){
                var links = linkify(text);
                console.log("R url : "+ links);
                console.log("Is array : "+ Array.isArray(links));
                console.log("array 0 : "+ links[0]);
                if(Array.isArray(links)){
                    getLinkData(post,likes_count,comments_count,links[0]);
                }else{
                    getLinkData(post,likes_count,comments_count,links);
                }
            }
        });
    });
    req.end();req.on('error', function (e) {console.error(e); });
}

function processPage(options, postsCount){
    if(postsCount < 2000 && options.path != undefined) {
        var data = "";
        var req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function (chunk) {
                processPage(data);
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
            });
        });
        req.end();
        req.on('error', function (e) {
            var date = new Date();
            errorLogStream.write(date + '\n' + err.stack + '\n\n');

            console.error(e);
        });
        console.log("Done with a batch : ");
    }
}

function processChannels(channelIndex){
    //mainOptions.path = 'https://graph.facebook.com/v2.3/338028696036/posts?limit=75&__paging_token=enc_AdBZBDrkyvrmXbBrovUGSJOTZAK14IZBNS6QVxb85eYJUAhybq4fNHuBgW3ePZA3kGguDXRIEDNrCrChkXZBcoiHaoxmjWZBIkwF5Upxx2MynSATJqXgZDZD&access_token=CAACEdEose0cBAGia5MbZCW1YLUF6YqiHjdNpZCbay4kOrTuVN9Nbb4n9ZB6y8OdSaK9ZBn2FLmiXDTO8LbTI4rrZBbMFhvFZCaZAFmACuWJZB8MZCiR2xik0LKSvJqoMyhVuv7xbPzQIsE4bPxRN95Y4PYRGhtLIEPiQbBk93iwU1JEPFf4jcFFQ9B7NfxEEtokarT2EDM8AcZCnY9Y3lO2ZAfz';
    mainOptions.path = 'https://graph.facebook.com/v2.3/' + channels[channelIndex] + '/posts?limit=75&access_token=' + access_token;
    processPage(mainOptions,75);
}

/* POST home page. */
router.get('/', function(request, res, next) {
    processChannels(0);
    res.json({status : "script started"});
});

module.exports = router;
