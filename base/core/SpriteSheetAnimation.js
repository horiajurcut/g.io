var base = base || {};
    base.core = base.core || {};
    
base.core.SpriteSheetAnimation = base.Class.$extend({
	__construct: function() {
		this.spriteSheet           = null;
		this.spriteIDs             = [];
		this.currentAnimationIndex = 0;
		this.animationIncPerFrame  = 1;
		this.paused                = false;
	}
});

base.core.SpriteSheetAnimation.prototype.draw = function(x, y, context) {
	if (!this.paused) {
		this.currentAnimationIndex +=  this.animationIncPerFrame;
	}
	var cIDX = Math.floor(this.currentAnimationIndex) % this.spriteIDs.length;
	
	var spt = this.spriteSheet.getSprite(this.spriteIDs[cIDX]);
	
	var hlf = {
		x: spt.centerX,
		y: spt.centerY
	};
	var mapTrans = {
		x: 0,
		y: 0
	};
	
	// context.clearRect(
	// 	(x - mapTrans.x) + (hlf.x), 
	// 	(y - mapTrans.y) + (hlf.y), 
	// 	spt.width, 
	// 	spt.height
	// );
	
	context.drawImage(
		this.spriteSheet.image, 
		spt.x, spt.y, 
		spt.width, spt.height, 
		(x - mapTrans.x) + (hlf.x), 
		(y - mapTrans.y) + (hlf.y), 
		spt.width, 
		spt.height
	);
}

base.core.SpriteSheetAnimation.prototype.pushFrame = function(id) {
	this.spriteIDs.push(id);
}