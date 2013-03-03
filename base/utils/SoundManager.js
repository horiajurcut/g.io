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
	(path instanceof String || typeof path == 'string') && this.soundQueue.push(path);
}

base.utils.SoundManager.prototype.pushSounds = function(path) {
	path instanceof Array && (this.soundQueue = this.soundQueue.concat(path));
}

base.utils.SoundManager.prototype.getSound = function(path) {
	return this.bufferList[path] || null;
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
				var sound = new base.utils.Sound({
					path: path,
					buffer: buffer,
					manager: self
				});
				self.bufferList[path] = sound;
				
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
	if (!(this.bufferList[path] instanceof base.utils.Sound)) return false;
	
	var sound = this.bufferList[path];
	
	!sound.finishedPlayback && sound.stop();
	
	sound.source = this.context.createBufferSource();
	
	sound.source.buffer = sound.buffer;
	sound.source.connect(this.context.destination);
	sound.source.connect(this.mainGainNode);
	
	sound.source.gain.value = sound._settings.volume || 0.8;
	sound.source.loop = sound._settings.looping || false;
	
	sound.source.noteOn(0);
	sound.finishedPlayback = false;
	
	return true;
}

base.utils.SoundManager.prototype.stopSound = function(path) {
	if (!(this.bufferList[path] instanceof base.utils.Sound)) return false;
	
	var sound = this.bufferList[path];
	
	sound.source.noteOff(0);
	sound.finishedPlayback = true;
	
	return true;
}

base.utils.SoundManager.prototype.stopAll = function() {
	for (path in this.bufferList) {
		this.bufferList[path].source && this.bufferList[path].stop();
	}
	
	this.mainGainNode.disconnect();
	this.mainGainNode = this.context.createGainNode(0);
	this.mainGainNode.connect(this.context.destination);
}

base.utils.SoundManager.prototype.downloadAll = function() {
	for (var i =0; i < this.soundQueue.length; i++) {
		this.loadBuffer(this.soundQueue[i]);
	}
}

base.utils.SoundManager.prototype.completed = function() {
	return (this.soundQueue.length == this.loadCount + this.errorCount);
}