var request = require("request");
var fq = require("./fileQueue.js");
//Load configuration for push notification
var config = require('konphyg')('./config');
var notifyConfigs = config("notify");
 
exports.notify = function(){
	if(notifyConfigs.allowNotify)
	{
		fq.length(function(data){
			request(notifyConfigs.url+"/"+data,function(error, response, body){
                        	if(error)
                        	{
                                	console.log("Error Notifying URL Submitted");
                        	}
                	});
		});
	}
};



