var base = base || {};
    base.core = base.core || {};
    
base.core.SpriteSheetAnimation = base.Class.$extend({
	spriteSheet: null,
	spriteIDs:   [],
	
	__construct: function(params) {
		
	}
});

base.core.SpriteSheetAnimation.prototype.draw = function(x, y, context) {
	var spt = this.spriteSheet.getSprite('walk_down_0002.png');
	
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