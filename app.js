var express = require('express'),
	url = require('url'),
	querystring = require('querystring'),
	https = require('https'),
    fs = require('fs');
//var redis = require("redis").createClient();

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
  
    var data = '';
    var obj = null;
    req.addListener('data', function(chunk) { console.log("chunk:"+chunk); data += chunk; });
    req.addListener('end', function() {
    	console.log("PARSING:");
        console.log( "data:"+data );
        obj = JSON.parse( data )
        if (null!=obj) {
        	for (key in obj) {console.log("key:"+key +" = "+obj[key]);}
  			var type = obj["Type"] || "";


        	if (type == "SubscriptionConfirmation") {	
        		handleSubscriptionConfirmation(obj);
			}

        	if (type == "Notification") {
        		handleNotification(obj);
        	}

	    } else {
	    	console.log("could not parse" + data);
	    }
		res.send([{name:'alarm1'}, {name:'alarm2'}]);
    	res.end();

    });

});

app.get('/aws-snsclient/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

function handleSubscriptionConfirmation(obj) {
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

	var url = obj["SubscribeURL"];
	url = (typeof(url)=="undefined")?"":url.substring(8);
	var urlhost = url.substring(0,url.indexOf("/"));
	var urlpath = url.substring(url.indexOf("/"));

	console.log("URL:"+url);
	console.log("HOST:"+urlhost);
	console.log("PATH:"+urlpath);

	var options = {
	  host: urlhost,
	  port: 443,
	  path: urlpath
	};

	https.get(options, function(res) {
	  console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}


function handleNotification(obj) {
	console.log("NOTIFICATION");
	var msg = obj["Message"];
	console.log(msg);
	if (typeof(msg)!="undefined") {
    	console.log("PARSING MESSAGE:");
		msg = JSON.parse( msg );

       	for (key in msg) {console.log("MSG:"+key +" = "+msg[key]);}

		var alarm = msg["AlarmName"];
		if (null != alarm) {
			//Monitor-Test
			//Ios Queue Overloaded
			//Production Done Overloaded
			//Error Queue Overloaded
			if (alarm == "Monitor-Test") {
				monitorTest(msg);
			}
			if (alarm == "Production Done Overloaded") {

			}
			if (alarm == "Error Queue Overloaded") {

			}
			if (alarm == "Ios Queue Overloaded") {

			}
			if (alarm == "Android Queue Overloaded") {

			}
			if (alarm == "BB Widget Queue Overloaded") {

			}
			if (alarm == "NumberOfMessagesReceived BB-Widget") {

			}
			if (alarm == "Symbian Queue Overloaded") {

			}
			if (alarm == "Winphone Queue Overloaded") {

			}
			if (alarm == "WebOS Queue Overloaded") {

			}
			if (alarm == "Unhealthy Hosts") {

			}
			if (alarm == "okapi-production-4 High-Status-Check-Failed-Any") {

			}
		}
	}
}

function monitorTest(msg) {
    console.log("MONITOR TEST:");
    //"NewStateValue":"OK"
    //"NewStateValue":"ALARM"
    //"NewStateValue":"INSUFFICIENT_DATA"
    jsonString = JSON.stringify(msg);

    fs.appendFile("public/test.json", jsonString, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}

function productionDoneOverloaded(msg) {
	
}

function errorQueueOverloaded(msg) {
	
}

function IosQueueOverloaded(msg) {
	
}

/*
{
  "Type" : "Notification",
  "MessageId" : "22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324",
  "TopicArn" : "arn:aws:sns:us-east-1:123456789012:MyTopic",
  "Subject" : "My First Message",
  "Message" : "Hello world!",
  "Timestamp" : "2012-05-02T00:54:06.655Z",
  "SignatureVersion" : "1",
  "Signature" : "EXAMPLEw6JRNwm1LFQL4ICB0bnXrdB8ClRMTQFGBqwLpGbM78tJ4etTwC5zU7O3tS6tGpey3ejedNdOJ+1fkIp9F2/LmNVKb5aFlYq+9rk9ZiPph5YlLmWsDcyC5T+Sy9/umic5S0UQc2PEtgdpVBahwNOdMW4JPwk0kAJJztnc=",
  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:123456789012:MyTopic:c9135db0-26c4-47ec-8998-413945fb5a96"
  }
*/


/*
"Timestamp" : "2013-06-21T17:17:26.932Z",
key:Message = {"AlarmName":"Production Done Overloaded",
				"AlarmDescription":"Too many apps waiting for upload",
				"AWSAccountId":"621255880182",
				"NewStateValue":"OK",
				"NewStateReason":"Threshold Crossed: 1 datapoint (1.0) was not greater than or equal to the threshold (50.0).",
				"StateChangeTime":"2013-06-21T17:17:26.871+0000",
				"Region":"US - N. Virginia",
				"OldStateValue":"INSUFFICIENT_DATA",
				"Trigger":{"MetricName":"ApproximateNumberOfMessagesVisible",
							"Namespace":"AWS/SQS",
							"Statistic":"AVERAGE",
							"Unit":null,
							"Dimensions":[{"name":"QueueName","value":"slicehost-production_done"}],
							"Period":60,
							"EvaluationPeriods":5,
							"ComparisonOperator":"GreaterThanOrEqualToThreshold",
							"Threshold":50.0}
				}
Timestamp = 2013-06-21T17:17:26.932Z
SignatureVersion = 1
*/

/*
Processing AWS SNS POST
chunk:{
chunk:ximateNumberOfMessagesVisible\",\"Namespace\":\"AWS/SQS\",\"Statistic\":\"AVERAGE\",\"Unit\":null,\"Dimensions\":[{\"name\":\"QueueName\",\"value\":\"slicehost-production_done\"}],\"Period\":60,\"EvaluationPeriods\":5,\"ComparisonOperator\":\"GreaterThanOrEqualToThreshold\",\"Threshold\":50.0}}",
   "MessageId" : "f8846f54-a4e7-5215-b505-256a28015368",
   "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
   "Type" : "Notification",
   "Signature" : "sldF/kJGP95Pxt+4hvBnMAy736s2HFHSR7mfxamLIYsZyV8LtorqRUdu4yEVJb33yRHL6BTfxDv/xxJe/ruwBQkGg9gjEWFo77Isv4GkUYqMSRvi2C3Z9SmL7ZBx2hefZhCd8MtUJWEBH/lRTKhOHymyd5g672PNp6bzCH+JtfM=",
   "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:621255880182:Queue-Overloaded:515aba4f-e552-40e6-b6bb-562d4c24660c"
   "SignatureVersion" : "1",
   "Subject" : "OK: \"Production Done Overloaded\" in US - N. Virginia",
   "Type" : "Notification",
 }
*/

/*
2013-06-21T19:08:27.805104+00:00 app[web.1]: NOTIFICATION
PARSING MESSAGE:
MSG:AlarmName = Monitor-Test
MSG:AlarmDescription = Monitor-Test
MSG:AWSAccountId = 621255880182
MSG:NewStateValue = INSUFFICIENT_DATA
MSG:NewStateReason = Insufficient Data: 1 datapoint was unknown.
MSG:StateChangeTime = 2013-06-21T19:08:27.647+0000
MSG:Region = US - N. Virginia
MSG:OldStateValue = ALARM
MSG:Trigger = [object Object]


2013-06-21T19:08:27.803129+00:00 app[web.1]:   "Signature" : "HP0mpVOgo+WLsjbU4E9EyC+0Vf+X6qqn0jBVlkuAGrElgyVhb4kCvwDnoif4ZQeblBHpE9qZN6QnblsYXk3h4tpxGsYLC+L/n58nRd9wu7FWqox+Jg6wh7aORdh7s0bJF1daRBX4IRxXRUfqFP7DMblv54p6ZlFW8IZASLcyqPw=",
2013-06-21T19:08:27.803129+00:00 app[web.1]:   "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",

Message = {"AlarmName":"Monitor-Test",
			"AlarmDescription":"Monitor-Test",
			"AWSAccountId":"621255880182",
			"NewStateValue":"INSUFFICIENT_DATA",
			"NewStateReason":"Insufficient Data: 1 datapoint was unknown.",
			"StateChangeTime":"2013-06-21T19:08:27.647+0000",
			"Region":"US - N. Virginia",
			"OldStateValue":"ALARM",
			"Trigger":{"MetricName":"RequestCount",
						"Namespace":"AWS/ELB",
						"Statistic":"SUM",
						"Unit":null,
						"Dimensions":[{"name":"LoadBalancerName","value":"staging"}],
						"Period":300,
						"EvaluationPeriods":1,
						"ComparisonOperator":"GreaterThanOrEqualToThreshold",
						"Threshold":1.0}
			}
*/



