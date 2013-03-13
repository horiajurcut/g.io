var base = base || {};
    base.core = base.core || {};
    
base.core.Map = base.Class.$extend({
	__construct: function() {
		this.mapData      = null;
		this.fullyLoaded  = false;
		this.imgLoadCount = 0;
		
		this.mapPixelSize = {
			x: 64,
			y: 64
		};
	}
});

base.core.Map.prototype.parseMapData = function(map) {
	this.mapData = JSON.parse(map);
}

base.core.Map.prototype.draw = function() {}