var express = require('express'),
	url = require('url'),
	querystring = require('querystring'),
    fs = require('fs');


//var aws = require('aws-sdk'), 
//    SNSClient = require('aws-snsclient');

var app = module.exports = express.createServer();

var auth = {
    region: 'us-east-1'
  , account: '000000000000' 
  , topic: 'Queue-Overloaded'
}
//var client = SNSClient(auth, function(err, message) {
//    console.log(message);
//});


// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});

//app.post('/receive', client);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.post('/aws-snsclient', function(req, res) {
	console.log("Processing AWS SNS POST");
  /*
  {
  "Type" : "SubscriptionConfirmation",
  "MessageId" : "165545c9-2a5c-472c-8df2-7ff2be2b3b1b",
  "Token" : "2336412f37fb687f5d51e6e241d09c805a5a57b30d712f794cc5f6a988666d92768dd60a747ba6f3beb71854e285d6ad02428b09ceece29417f1f02d609c582afbacc99c583a916b9981dd2728f4ae6fdb82efd087cc3b7849e05798d2d2785c03b0879594eeac82c01f235d0e717736",
  "TopicArn" : "arn:aws:sns:us-east-1:123456789012:MyTopic",
  "Message" : "You have chosen to subscribe to the topic arn:aws:sns:us-east-1:123456789012:MyTopic.\nTo confirm the subscription, visit the SubscribeURL included in this message.",
  "SubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-east-1:123456789012:MyTopic&Token=2336412f37fb687f5d51e6e241d09c805a5a57b30d712f794cc5f6a988666d92768dd60a747ba6f3beb71854e285d6ad02428b09ceece29417f1f02d609c582afbacc99c583a916b9981dd2728f4ae6fdb82efd087cc3b7849e05798d2d2785c03b0879594eeac82c01f235d0e717736",
  "Timestamp" : "2012-04-26T20:45:04.751Z",
  "SignatureVersion" : "1",
  "Signature" : "EXAMPLEpH+DcEwjAPg8O9mY8dReBSwksfg2S7WKQcikcNKWLQjwu6A4VbeS0QHVCkhRS7fUQvi2egU3N858fiTDN6bkkOxYDVrY0Ad8L10Hs3zH81mtnPk5uvvolIC1CXGu43obcgFxeL3khZl8IKvO61GWB6jI9b5+gLPoBc1Q=",
  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem"
  }
  */
    //parse
 // parses the request url
 //   console.log(req.body);
    var data = '';
    var obj = null;
    req.addListener('data', function(chunk) { console.log("chunk:"+chunk); data += chunk; });
    req.addListener('end', function() {
    	console.log("PARSING:");
        console.log( "data:"+data );
        obj = JSON.parse( data )
//        res.writeHead(200, {'content-type': 'text/plain' });
        if (obj!=null) {
        	for (key in obj) {console.log("key:"+key +" = "+obj[key]);}
			var url = obj.SubscribeURL;
			var urlhost = url.substring(url,0,url.indexOf("/"));
			var urlpath = url.substring(url,url.indexOf("/"));

			var options = {
			  host: urlhost,
			  port: 80,
			  path: urlpath
			};

			http.get(options, function(res) {
			  console.log("Got response: " + res.statusCode);
			}).on('error', function(e) {
			  console.log("Got error: " + e.message);
			});
	    } else {
	    	console.log("could not parse" + data);
	    }
	res.send([{name:'alarm1'}, {name:'alarm2'}]);
    res.end()

    });

/*
    var theUrl = url.parse( req.url );
    // gets the query part of the URL and parses it creating an object
    var queryObj = querystring.parse( theUrl.query );

    // queryObj will contain the data of the query as an object
    // and jsonData will be a property of it
    // so, using JSON.parse will parse the jsonData to create an object
    console.log(queryObj.jsonData);
    var obj = JSON.parse( queryObj.jsonData );
    var obj = JSON.parse( req.body );

    // as the object is created, the live below will print "bar"
    console.log( obj );

*/

});

app.get('/aws-snsclient/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
