var request = require("request");

for(var i=0; i<10;i++)
{
	request("http://localhost:8080/pop",function(err,res,body){
		console.log(body);
	})
}
