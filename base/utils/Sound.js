var base = base || {};
    base.utils = base.utils || {};
    
base.utils.Sound = function(params) {
	this.path     = params.path || null;
	this.source   = null;
	this.manager  = params.manager || {};
	this.buffer   = params.buffer || {};
	this.settings = params.settings || {};
}

base.utils.Sound.prototype.play = function() {
	this.manager.playSound(this.path);
}

base.utils.Sound.prototype.stop = function() {
	this.manager.stopSound(this.path);
}

base.utils.Sound.prototype.setVolume = function(volume) {
	this.settings.volume = volume;
}