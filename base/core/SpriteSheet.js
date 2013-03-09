var base = base || {};
    base.core = base.core || {};
    
base.core.SpriteSheet = base.Class.$extend({
	image:       null,
	spriteData:  null,
	imagePath:   '',
	dataPath:    '',
	sprites:     [],
	
	__construct: function(params) {
		params = params || {};
		
		this.dataPath  = params.dataPath || null;
		this.imagePath = params.imagePath || null;
	}
});

base.core.SpriteSheet.prototype.load = function() {
	this.loadSpriteSheetData();
	this.loadSpriteSheetImage();
}

base.core.SpriteSheet.prototype.loadSpriteSheetData = function() {
	var self = this;
	
	var request = new base.utils.Request({
		url: this.dataPath,
		method: 'GET',
		success: function(spriteSheet) {
			self.parseData(spriteSheet, function() {});
		}
	});
	
	request.send();
}

base.core.SpriteSheet.prototype.loadSpriteSheetImage = function() {
	this.image = new Image();
	
	this.image.onload = function() {
		
	}
	
	this.image.src = this.imagePath; 
}

base.core.SpriteSheet.prototype.parseData = function(spriteSheet) {
	this.spriteData = JSON.parse(spriteSheet);
	
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