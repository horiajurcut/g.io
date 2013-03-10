var base = base || {};
    base.core = base.core || {};

base.core.Engine = base.Class.$extend(
	mainContext:  null,
	assets:       [],
	player:       null,
	enemies:      [],
	
	spriteSheets: [],
	map:          null,
	
	__construct: function(params) {
		params = params || {};
		
		this.map    = params.map || {};
		this.player = params.player || {};
	}
);

base.core.Engine.prototype.preloadAssets = function(callback) {
	this.map.loadMapData(callback);
	
	for (var i = 0; i < this.spriteSheets.length; i++) {
		this.spriteSheets[i].load(callback);
	}
}

base.core.Engine.prototype.pushSpriteSheet = function(spriteSheet) {
	this.spriteSheets.push(spriteSheet);
}

base.core.Engine.prototype.update = function() {
	
}

base.core.Engine.prototype.draw = function() {
	this.map.draw();
	this.player.draw();
}

base.core.Engine.prototype.run = function() {
	if (!this.fullyLoaded == true) return;
	
	this.update();
	this.draw();
}