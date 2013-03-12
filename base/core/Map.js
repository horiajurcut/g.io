var base = base || {};
    base.core = base.core || {};
    
base.core.Map = base.Class.$extend({
	mapData: null,
	fullyLoaded: false,
	mapPixelSize: {
		x: 64,
		y: 64
	},
	imgLoadCount: 0,
	
	__construct: function() {}
});

base.core.Map.prototype.parseMapData = function(map) {
	this.mapData = JSON.parse(map);
}

base.core.Map.prototype.draw = function() {
	
}