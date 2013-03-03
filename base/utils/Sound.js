var base = base || {};
    base.utils = base.utils || {};
    
base.utils.Sound = function(params) {
	this.path      = params.path || null;
	this.source    = null;
	this.manager   = params.manager || {};
	this.buffer    = params.buffer || {};
	this._settings = params.settings || {};
	
	this.finishedPlayback = true;
}

base.utils.Sound.prototype.play = function() {
	this.manager.playSound(this.path);
}

base.utils.Sound.prototype.stop = function() {
	this.manager.stopSound(this.path);
}

base.utils.Sound.prototype.settings = function(options) {
	this._settings = options || {};
}