var base = base || {};
    base.core = base.core || {};

base.core.Level = base.Class.$extend({
	__construct: function() {
		this.assets       = []
		this.loadCount    = 0;
		this.errorCount   = 0;
		
		this.spriteSheets = [];
		this.map          = null;
		
		this.fullyLoaded  = false;
		this.loadCallback = null;
		
	}
});

base.core.Level.prototype.load = function(engine) {
	this.loadCallback = engine;
	
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
		
		if (this.assets[i].type == 'atlas') {
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
		this.loadCallback.loadCompleted();	
	}
}

base.core.Level.prototype.defineAssets = function(assets) {
	this.assets = assets || {};
}