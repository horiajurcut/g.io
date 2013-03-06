var base = base || {};
    base.core = base.core || {};
    
base.core.Map = base.Class.$extend({
	resourceDir: '',
	mapData: null,
	fullyLoaded: false,
	mapPixelSize: {
		x: 64,
		y: 64
	},
	imgLoadCount: 0,
	
	__construct: function(params) {
		this.resourceDir = params.resourceDir || '';
	}
});

base.core.Map.prototype.loadMapData = function(path, callback) {
	var self = this;
	
	var request = new base.utils.Request({
		url: this.resourceDir + path,
		method: 'GET',
		success: function(map) {
			self.parseMapData(map, callback);
		}
	});
	
	request.send();
}

base.core.Map.prototype.parseMapData = function(map) {
	this.mapData = JSON.parse(map);
}

base.core.Map.prototype.draw = function() {
	
}