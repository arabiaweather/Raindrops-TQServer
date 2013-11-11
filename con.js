var fq = require("./lib/fileQueue.js");

fq.init(function(){

	console.log("Poping")

	for(var i=0; i<10; i++)
	{
		fq.tpop(function(data){
			console.log(data)	
			console.log(i);
		});
	}
});
