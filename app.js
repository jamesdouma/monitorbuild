var express = require('express'),
	url = require('url'),
	querystring = require('querystring'),
	https = require('https'),
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
  
    var data = '';
    var obj = null;
    req.addListener('data', function(chunk) { console.log("chunk:"+chunk); data += chunk; });
    req.addListener('end', function() {
    	console.log("PARSING:");
        console.log( "data:"+data );
        obj = JSON.parse( data )
        if (null!=obj) {
        	for (key in obj) {console.log("key:"+key +" = "+obj[key]);}


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
  			var type = obj["Type"] || "";
        	if (type == "SubscriptionConfirmation") {	

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

        	if (type == "Notification") {
		    	console.log("NOTIFICATION");
        		// Metric Name
//	        	if (obj["Subject"] == "OK: \"Production Done Overloaded\" in US - N. Virginia") {
    		    	console.log("PARSING MESSAGE:");
	        		var msg = obj["Message"];
    		    	console.log(msg);
	        		if (typeof(msg)!="undefined") {
	        			msg = JSON.parse( msg )
    
				       	for (key in msg) {console.log("MSG:"+key +" = "+msg[key]);}

	        			var alarm = msg["AlarmName"];
	        			if (null != alarm) {
	        				if (alarm == "Production Done Overloaded") {

	        				}
	        			}
	        		}
//	        	}
        	}

	    } else {
	    	console.log("could not parse" + data);
	    }
	res.send([{name:'alarm1'}, {name:'alarm2'}]);
    res.end()

    });


});

app.get('/aws-snsclient/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

/*
{
    "Timestamp": "2013-06-10T15:56:21.411Z",
    "HistoryItemType": "StateUpdate",
    "AlarmName": "Ios Queue Overloaded",
    "HistoryData": {
        "version": "1.0",
        "oldState": {
            "stateValue": "OK",
            "stateReason": "Threshold Crossed: 1 datapoint (30.0) was not greater than or equal to the threshold (50.0).",
            "stateReasonData": {
                "version": "1.0",
                "queryDate": "2013-06-03T19:56:21.381+0000",
                "startDate": "2013-06-03T19:41:00.000+0000",
                "statistic": "Average",
                "period": 300,
                "recentDatapoints": [
                    67,
                    30
                ],
                "threshold": 50
            }
        },
        "newState": {
            "stateValue": "ALARM",
            "stateReason": "Threshold Crossed: 2 datapoints were greater than or equal to the threshold (50.0). The most recent datapoints: [55.0, 55.0].",
            "stateReasonData": {
                "version": "1.0",
                "queryDate": "2013-06-10T15:56:21.392+0000",
                "startDate": "2013-06-10T15:41:00.000+0000",
                "statistic": "Average",
                "period": 300,
                "recentDatapoints": [
                    55,
                    55
                ],
                "threshold": 50
            }
        }
    },
    "HistorySummary": "Alarm updated from OK to ALARM"
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


