//TODO: Clean up, create json package, submit to NPM, check error handling on all routes, build automation tester 
var fq = require("./lib/fileQueue.js");
var restify = require("restify");
//TODO: Call fq init before server starts
function pushQ(req, res, next)
{
	if(!(req.params.data === undefined))
	{	
		fq.push(req.params.data);
		res.send(201);
	}
	else
	{
		res.send(406,"Data Json Object must be spesified");
	}
	return next;
}

function popQ(req, res, next)
{
	//TODO:create non-transactional pop in lib
}

function tPopQ(req, res, next)
{
	fq.tpop(function(data){
		if(data == null)
		{
			res.send(204);
		}
		else
		{
			res.send(200,data);
		}
	});
	return next;
}

function commitKey(req, res, next)
{
	fq.commit(req.params.key, function(err){
		if(err == false)
		{
			res.send(200);
		}
		else if (err = -1)
		{
			res.send(404,"Key Not Found");
		}
		else
		{
			res.send(500, "Key was not commited, error occured, " + err.toString());
		}
	});
return next;
}

function rollBack(req, res, next)
{
	fq.rollback(req.params.key, function(err){
		if(err == false)
                {
                        res.send(200);
                }
                else if (err = -1)
                {
                        res.send(404,"Key Not Found");
                }
                else
                {
                        res.send(500, "Key was not commited, error occured, " + err.toString());
                }

	});	
}

function rollBackAll(req, res, next)
{
	//TODO: In Lib
}

function commitAll(req, res, next)
{
	//TODO: in Lib
}

function clearAll(req, res, next)
{
	//TODO: Implement from Lib
}

var server = restify.createServer();

server.use(restify.bodyParser())
//TODO: Set server specs (jsonp + ip restrictions + etc....)
server.post('/push', pushQ);
server.get('/pop', popQ);
server.get('/tpop', tPopQ);
server.get('/commit/:key',commitKey);
server.get('/rollback/:key', rollBack);
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
