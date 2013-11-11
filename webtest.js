var request = require('request')

for(var i =0; i< 10; i++)
{
	request.post("http://localhost:8080/push", JSON.stringify({data:{count:i}}),function(e,r,body){
		console.log(body);
	});	
}

;
