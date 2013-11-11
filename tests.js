var fq = require('./lib/fileQueue');
fq.createDirs();
/*for(var i = 0; i<100; i++)
{
	fq.push({count:i});
}
*/


/*
fq.tpop(function(data){
	console.log(data);
});
*/



/*
fq.rollback("hnumywb5",function(err){
	console.log(err);
}); 
*/

/*
fq.length(function(count){
	console.log(count);
});
*/

fq.clearAll();
