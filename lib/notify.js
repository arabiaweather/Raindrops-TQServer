var request = require("request");

//Load configuration for push notification
var config = require('konphyg')('./config');
var notifyConfigs = config("notify");
console.log(notifyConfigs);
 
exports.notify = function(){
	if(notifyConfigs.allowNotify)
	{
		request(notifyConfigs.url,function(error, response, body){
			if(error)
			{
				console.log("Error Notifying URL Submitted");
			}
		console.log(body);	
		});
	}
};

//TODO: Read back response from the request to see if it was correctly done
