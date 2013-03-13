var base = base || {};
    base.core = base.core || {};
    
base.core.Player = base.Class.$extend({
	__construct: function() {
		this.positionX = 0;
		this.positionY = 0;
		
		this.animations       = {};
		this.currentAnimation = null;
	}
});

base.core.Player.prototype.draw = function(context) {
	this.positionX += 1;
	this.animations[this.currentAnimation].draw(this.positionX, this.positionY + 100, context);
}