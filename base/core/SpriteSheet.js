var base = base || {};
    base.core = base.core || {};
    
base.core.SpriteSheet = base.Class.$extend({
	__construct: function() {
		this.image       = null;
		this.spriteData  = null;
		this.sprites     = [];
		this.fullyLoaded = false;
	}
});

base.core.SpriteSheet.prototype.parseData = function(options, level) {
	this.spriteData = JSON.parse(options.spriteSheet);
	
	for (var spriteID in this.spriteData.frames) {
		var spriteObj = this.spriteData.frames[spriteID];
		
		var params = {
			id:       spriteID,
			x:        spriteObj.frame.x,
			y:        spriteObj.frame.y,
			width:    spriteObj.frame.w,
			height:   spriteObj.frame.h,
			centerX:  -(spriteObj.frame.w * 0.5),
			centerY:  -(spriteObj.frame.h * 0.5)
		};
		
		if (spriteObj.trimmed) {
			params.centerX = spriteObj.spriteSourceSize.x - (spriteObj.sourceSize.w * 0.5);
			params.centerY = spriteObj.spriteSourceSize.y - (spriteObj.sourceSize.h * 0.5);
		}
		
		this.defineSprite(params);
	}
	
	this.image = new Image();
	this.image.onload = function() {};
	this.image.src = options.image; 
	
	this.fullyLoaded = true;
	level.loadCompleted();
}

base.core.SpriteSheet.prototype.defineSprite = function(params) {
	var sprite = new base.core.Sprite(params);
	
	this.sprites.push(sprite);
}

base.core.SpriteSheet.prototype.getSprite = function(id) {
	for (var i = 0; i < this.sprites.length; i++) {
		if (this.sprites[i].id == id) return this.sprites[i];
	}
	
	return null;
}