var fs = require('fs');
var rimraf = require('rimraf');
var memq = require('./memQueue.js');
var async = require('async');

exports.init = function(cb){

	fs.readdir("./dat/q",function(err, files){
		for(file in files)
		{
			memq.q.push(files[file]);
		}
		memq.q = memq.q.sort(function(a,b){return b-a});
		cb();
	});	
};

exports.push = function(data){
	createItem(data);
};

exports.tpop = function(cb){
	popTStack(cb);
};

exports.pop = function(cb){
	pop(cb);
};

exports.commit = function(key, cb){
	commit(key,cb);
};

exports.rollback = function(key, cb){
	rollback(key,cb);
};

exports.length = function(cb){
	getLength(cb);
};
exports.clearAll = function(cb){
	clearAll(cb);
};
exports.createDirs = function(){
	createDirs();
};

exports.commitAll = function(cb)
{
	commitAll(cb);
};

exports.rollbackAll = function(cb)
{
	rollbackAll(cb);
};

function getLength(cb)
{
	var ques = memq.q.length;
	cb(ques);	
}

function clearAll(cb)
{
	rimraf('./dat/',function(err){
		if(err)
		{
			throw err;
		}
		else
		{
			memq.q = [];
			createDirs(cb);		
		}
	});
	
}

function createItem(data)
{
	if(typeof(data) == "object")
	{
		//Save as object
		strData = JSON.stringify(data);
		//Save to file
		saveToFile(uid(), strData);  
	}
	else
	{
		//Save as string
		saveToFile(uid(), data);
	}
}

function pop(cb)
{
	popTStack(function(res){
		if(res != null)
		{
			commit(res.commitKey,function(){
			});
		cb(res.data);
		}
		else
		cb(null);
	});
}

function popTStack(cb)
{
		if(memq.q.length != 0)
		{
			var filesSorted = memq.q.sort(function(a,b){return b-a});
			var file = filesSorted.pop();
			memq.tmp.push(file);
			fs.rename("./dat/q/"+file, "./dat/tmp/"+file,  function(err){
				fs.readFile('./dat/tmp/'+file,"utf8",function (err, content)
				{
					if(isJSON(content))
					{
						cb({data: JSON.parse(content), commitKey: file});


					}
					else
					{
        	                        	cb({data: content, commitKey: file});
					}
	                        });

			});
		}
		else
		{
			cb(null);
		}
}

var incCounter = 0; //Reset after 1K
function uid()
{	
	incCounter++;
	var ts = parseInt(new Date().getTime())+incCounter;
	return ts.toString();		
}

function createDirs(cb)
{
	fs.exists("./dat", function(exists){
		if(!exists)
		{
			fs.mkdir("./dat",function(err){
				if(err) throw err;
				fs.exists("./dat/q", function(exists){
                		if(!exists)
                			{
                		        	fs.mkdir("./dat/q",function(err){
							if(err) throw err;
							fs.exists("./dat/tmp", function(exists){
                					if(!exists)
                						{
                        						fs.mkdir("./dat/tmp", function(){
										if(err) throw err;
										cb(true);
									});
                						}
        						});
						});
                			}
        			});	
			});
		}
	});
}

function isJSON(text)
{
	if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
	replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
	replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) 
	{
	  return true;
	}else{
	return false; 
	}
}

function saveToFile(filename, data)
{
	fs.writeFile("./dat/q/"+filename, data, function(err) {
    		if(err) {
        		console.log(err);
	    	} 
		else 
		{
			memq.q.push(filename);

		}	
	});
}


function commit(key, cb)
{
	fs.exists("./dat/tmp/"+key, function(exists){
		if(exists)
		{
			fs.unlink("./dat/tmp/"+key,function(err){
				if(err)
				{
					cb(err);
				}
				else
				{
					cb(false);
				}
				
			});			
		}
		else
		{
			cb(-1); //Invalid Key 	
		}
	});
}

function rollback(key, cb)
{
	fs.exists("./dat/tmp/"+key, function(exists){
		if(exists)
		{
			fs.rename("./dat/tmp/"+key,"./dat/q/"+key,function(err){
				if(err) {
						cb(err);
					} 
					else 
					{
						cb(false);
						memq.q.push(key);
					} 
			});
		}
		else
		{
			cb(-1);	
		}
	});
}


function commitAll(cb)
{
	fs.readdir('./dat/tmp',function(err,files){
		if(err) throw err;
		for(file in files)
		{
			fs.unlink("./dat/tmp/"+files[file]);
		}
		cb(true);
	});	
}

function rollbackAll(cb)
{

	fs.readdir('./dat/tmp',function (err, files){
		async.whilst(
			function () {

				return files.length > 0; 
			},
			 function (callback) {
				var newItem = files.pop();
				rollback(newItem, function(err){
					callback();
				 });
	    		},
	    		function (err) {
				cb(false);
	    		}
		);
		});
}
