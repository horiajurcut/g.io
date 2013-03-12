var base = base || {};
    base.core = base.core || {};

base.core.Level = base.Class.$extend({
	mainContext:  null,
	
	assets:       [],
	loadCount:    0,
	errorCount:   0,
	
	player:       null,
	enemies:      [],
	
	spriteSheets: [],
	map:          null,
	
	fullyLoaded:  false,
	loadCallback: null,
	
	__construct: function() {}
});

base.core.Level.prototype.load = function(callback) {
	this.loadCallback = callback;
	
	var self = this;
	
	for (var i = 0; i < this.assets.length; i++) {	
		if (this.assets[i].type == 'map') {
			var request = new base.utils.Request({
				
				url: this.assets[i].src,
				method: 'GET',
				
				success: function(map) {
					var tileMap = new base.core.TileMap();
					
					tileMap.parseMapData(map, self);
					self.map = tileMap;
				}
			});
			
			request.send();	
		}
		
		if (this.assets[i].type == 'sheet') {
			var spriteImage = this.assets[i].image;
			
			var request = new base.utils.Request({
				url: this.assets[i].src,
				method: 'GET',
				success: function(spriteSheet) {
					var sheet = new base.core.SpriteSheet();
					
					sheet.parseData({
						spriteSheet: spriteSheet,
						image:       spriteImage
					}, self);
					
					self.spriteSheets.push(sheet);
				}
			});
			
			request.send();
		}
	}
}

base.core.Level.prototype.loadCompleted = function() {
	this.loadCount += 1;
	
	if (this.loadCount == this.assets.length) {
		this.fullyLoaded = true;
		this.loadCallback();	
	}
}

base.core.Level.prototype.defineAssets = function(assets) {
	this.assets = assets || {};
}

base.core.Level.prototype.update = function() {
	
}

base.core.Level.prototype.draw = function() {
	this.map.draw(this.mainContext);
	//this.player.draw();
}

base.core.Level.prototype.run = function() {
	if (!this.fullyLoaded == true) return;
	
	this.update();
	this.draw();
}