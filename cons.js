var fq = require("./lib/fileQueue.js");


for(var i = 0; i<100; i++)
{
fq.tpop(function(data){
	console.log(data);
});
}
