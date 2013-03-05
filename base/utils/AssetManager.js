var base = base || {};
    base.utils = base.utils || {};

base.utils.AssetManager = function() {
	this.loadCount = 0;
	this.errorCount = 0;
	
	this.cache = {};
	this.imageQueue = [];
}

base.utils.AssetManager.prototype.pushAsset = function(path) {
	this.imageQueue.push(path);
}

base.utils.AssetManager.prototype.downloadAll = function(callback) {
	var self = this
	    path = null,
	    img = null;
	
	if (this.imageQueue.length === 0) callback();
	
	for (var i = 0; i < this.imageQueue.length; i++) {
		var path = this.imageQueue[i],
		    img = new Image();
		    
		img.addEventListener('load', function() {
			this.loadCount++;
			self.completed() && callback();
		}, false);
		
		img.addEventListener('error', function() {
			this.errorCount++;
			self.completed() && callback();
		}, false);
		
		img.src = path;
		this.cache[path] = img;
	}
}

base.utils.AssetManager.prototype.completed = function() {
	return (this.imageQueue.length == this.loadCount + this.errorCount);
}

base.utils.AssetManager.prototype.getAsset = function(path) {
	return this.cache[path];
}