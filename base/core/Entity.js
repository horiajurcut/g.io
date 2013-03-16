var base = base || {};
    base.core = base.core || {};
    
base.core.Entity = base.Class.$extend({
	__construct: function() {
		this.position = {
			x: 0,
			y: 0
		};
		
		this.size = {
			x: 0,
			y: 0
		};
		
		this.halfSize = {
			x: 0,
			y: 0
		}
		
		this.lastPosition = {
			x: 0,
			y: 0	
		};
		
		this.animations       = {};
		this.currentAnimation = null;
		
		this.spriteSheetName = null;
		this.zIndex = 0;
		
		this._killed = false;
	}
});

base.core.Entity.prototype.update = function() {
	
}

base.core.Entity.prototype.draw = function(context) {
	var pos = this.position;
	
	this.animations[this.currentAnimation].draw(pos.x, pos.y + 100, context);
}