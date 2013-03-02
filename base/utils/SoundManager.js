var base = base || {};
    base.utils = base.utils || {};

base.utils.SoundManager = function() {
	this.context = null;
	this.mainGainNode = null;
	
	this.soundQueue = [];
	this.bufferList = {};
	
	this.loadCount = 0;
	this.errorCount = 0;
	
	this.ondownload = null;
}

base.utils.SoundManager.prototype.init = function(options) {
	try {
		this.context = new webkitAudioContext();
	} catch(e) {
		alert('Web Audio API is not supported in this browser');
	}
	
	this.mainGainNode = this.context.createGainNode();
	this.mainGainNode.connect(this.context.destination);
	
	this.ondownload = options.ondownload;
}

base.utils.SoundManager.prototype.pushSound = function(path) {
	this.soundQueue.push(path);
}

base.utils.SoundManager.prototype.loadBuffer = function(path) {
	var self = this;
	
	var onDecodeError = function(error) {
		alert('Cannot decode');
	}
	
	var request = new base.utils.Request({
		url: path,
		method: 'GET',
		type: 'arraybuffer',
		success: function(answer) {
			self.context.decodeAudioData(answer, function(buffer) {
				self.bufferList[path] = buffer;
				
				++self.loadCount;
				self.completed() && self.ondownload instanceof Function && self.ondownload.apply(this);
			}, onDecodeError);
		},
		notFound: function(answer) {
			++self.errorCount;
			self.completed() && self.ondownload instanceof Function && self.ondownload.apply(this);
		}
	});
	
	request.send();
}

base.utils.SoundManager.prototype.playSound = function(path) {
	if (!(this.bufferList[path] instanceof Object)) return false;
	
	var source = this.context.createBufferSource();
	
	source.buffer = this.bufferList[path];
	source.connect(this.context.destination);
	source.connect(this.mainGainNode);
	
	source.gain.value = 0.8;
	source.noteOn(0);
	
	return true;
}

base.utils.SoundManager.prototype.downloadAll = function() {
	for (var i =0; i < this.soundQueue.length; i++) {
		this.loadBuffer(this.soundQueue[i]);
	}
}

base.utils.SoundManager.prototype.completed = function() {
	return (this.soundQueue.length == this.loadCount + this.errorCount);
}