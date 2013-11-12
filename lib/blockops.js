
var isBlocked = true; 
exports.block = function(){
	isBlocked = true;
};

exports.unBlock = function(cb){
	isBlocked = false;
	cb(true);
};

exports. isBlocked = function(){
	return isBlocked;
};
