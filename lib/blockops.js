
var isBlocked = true; 
exports.blockRequests = function(){
	isBlocked = true;
};

exports.unBlockRequests = function(){
	isBlocked = false;
};

exports. isBlocked = function(){
	return isBlocked;
};
