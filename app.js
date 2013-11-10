//Require File Queue 
var Queue = require('file-queue').Queue;
//Require resitfy to create REST API interface 
var restify = require('restify');

//Create Queue Object
var queue = new Queue('./queue', function(err) {
	if(err) console.log("Error: Error generating Queue Object");  
});

queue.clear(function(err) { if (err) throw err; });

//TODO: Save those arrays in a file since if server breaks to be able to continue 
var commitKeys = {};
var rollBackKeys = {};
function pushQ(req, res, next)
{
	//TODO: Check if the req.params.data exists
	queue.push(req.headers.data, function (err) {
		if(err) throw err; //TODO: Throw over REST
		res.send(201);
	});

	return next;
}

function popQ(req, res, next)
{
//TODO: Count and if 0 then do not push to avoid hangs 
	queue.pop(function(err, message) {
		if (err) throw err; //TODO: Throw over REST 
		res.send(message);
	});
	return next;
}

function tPopQ(req, res, next)
{
	queue.tpop(function(err, message, commit, rollback) 
	{
		var newCommitKey = new Date().getTime() + 'a'; 
		commitKeys[newCommitKey] = commit;
		rollBackKeys[newCommitKey] = rollback;
		res.send({commitKey:newCommitKey, data:message}); //TODO: Set Header 200
	});
	return next;
}

function commitKey(req, res, next)
{
	commitKeys[req.params.key](function(err){if(err) throw err;});
	res.send(202);
	//TODO: Remove Key here 
	return next;
}

function rollBack(req, res, next)
{
	rollBackKeys[req.params.key](function(err){if(err) throw err;})
	res.send(202);
	//TODO: Remove Key Here 
	return next;
}


//Restify Server Setup with routes 
var server = restify.createServer();
server.post('/push', pushQ);
server.get('/pop', popQ);
server.get('/tpop', tPopQ);
server.get('/commit/:key',commitKey);
server.get('/rollback/:key', rollBack);
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
