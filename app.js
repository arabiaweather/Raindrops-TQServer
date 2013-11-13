var sys = require('sys');
var asciimo = require('asciimo').Figlet;
var colors = require('colors'); // add colors for fun


var font = 'Colossal';
var welcome = "TQ-Server";
asciimo.write(welcome,font,function(art){
	sys.puts(art.green);
});

var fq = require("./lib/fileQueue.js");
var restify = require("restify");
var notify = require("./lib/notify.js");
var config = require('konphyg')('./config');
var serverConfigs = config("main");
var blockops = require('./lib/blockops.js');

console.log(serverConfigs);

var ips = serverConfigs.ips; 


function length(req, res, next)
{
	fq.length(function(len){
		res.send(200,len);
	});
	return next;
}

function pushQ(req, res, next)
{
console.log(req.params);
	if(!(req.params.data === undefined))
	{	
		fq.push(req.params.data);
		res.send(201);
		notify.notify();
	}
	else
	{
		res.send(406,"Data Json Object must be spesified");
	}
	return next;
}

function popQ(req, res, next)
{


	fq.pop(function(data){
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

function clearAll(req, res, next)
{
	blockops.block();
	fq.clearAll(function(resp){
		if(resp) 
			{
				blockops.unBlock(function(resp){
					if(resp)
					{
						res.send(200,"Cleared All Data, Server is unblocked");
					}
				});
			}	
	});
	return next;	
}


function commitAll(req, res, next){
	blockops.block();
	fq.commitAll(function(resp){
		if(resp)
		{

			blockops.unBlock(function(resp){
				res.send(200,"All Items Commited, Block removed from server");
			});
		}
	});
};

function rollbackAll(req, res, next)
{
	blockops.block();
	fq.rollbackAll(function(err){

		if(err) 
		{
			blockops.unBlock();
			console.log("err");
			throw err;
		}
		else
		{
			blockops.unBlock(function(resp){
				if(resp){
						res.send(200,"All Items rolledback, Block on reuests removed");
					}
				else
					{
						res.send(500, "An Error has occured");
					}
			});
		}
	})
	return next;
}

var server = restify.createServer();

server.use(restify.bodyParser())


//Block ips that are not allowed, also make sure requests not blocked from clear,commit and rollback all
server.pre(function(req, res, next) {
	if((ips.indexOf(req.connection.remoteAddress)) == -1)
	{
		res.send(403,"Remote Address not allowed");

	}
	if (blockops.isBlocked())
	{
		res.send(500,"Server currently Blocked for a Transactional Process");
	}
	return next();
});


server.use(restify.jsonp());
server.use(restify.gzipResponse());

server.post('/push', pushQ);
server.get('/pop', popQ);
server.get('/tpop', tPopQ);
server.get('/commit/:key',commitKey);
server.get('/rollback/:key', rollBack);
server.get('/length', length);
server.get('/clearAll',clearAll);
server.get('/commitAll', commitAll);
server.get('/rollbackAll', rollbackAll);
fq.init(function(){
	server.listen(serverConfigs.port, function() {
		console.log('%s listening at %s', "TQ-SERVER", server.url);
		//Server Start Notify with push
		notify.notify();
		blockops.unBlock(function(resp){});
	});
});



