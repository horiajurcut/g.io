var base = base || {};
    base.core = base.core || {};

base.core.Level = base.Class.$extend({
	__construct: function() {
		this.mainContext  = null;
		
		this.assets       = []
		this.loadCount    = 0;
		this.errorCount   = 0;
		
		this.player       = null;
		this.enemies      = [];
		
		this.spriteSheets = [];
		this.map          = null;
		
		this.fullyLoaded  = false;
		this.loadCallback = null;
		
	}
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

base.core.Level.prototype.init = function() {
	var player = new base.core.Player(),
		cycles = ['walk_right', 'chaingun_impact'];
		
	for (var i = 0; i < cycles.length; i++) {
		var action = new base.core.SpriteSheetAnimation();
		
		for(var frame = 0; frame < 10; frame++) {
			action.pushFrame(cycles[i] + '_000' + frame + '.png');
		}

		for(var frame = 10; frame < 30; frame++) {
			action.pushFrame(cycles[i] + '_00' + frame + '.png');
		}
		
		action.spriteSheet = this.spriteSheets[0];
		player.animations[cycles[i]] = action;
	}
	
	player.currentAnimation = 'walk_right';
	this.player = player;						
}

base.core.Level.prototype.update = function() {
	
}

base.core.Level.prototype.draw = function() {
	this.map.draw(this.mainContext);
	this.player.draw(this.mainContext);
}

base.core.Level.prototype.run = function() {
	if (!this.fullyLoaded == true) return;
	
	this.update();
	this.draw();
}