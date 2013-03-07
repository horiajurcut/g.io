var base = base || {};
    base.core = base.core || {};
    
base.core.CanvasTile = base.Class.$extend({
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	canvasHandle: null,
	context: null
});

base.core.CanvasTile.prototype.create = function(width, height) {
	this.x = -1;
	this.y = -1;
	
	this.width = width;
	this.height = height;
	
	var cnvs = document.createElement('canvas');
	cnvs.width = width;
	cnvs.height = height;
	
	this.canvasHandle = cnvs;
	this.context = cnvs.getContext('2d');
}

base.core.CanvasTile.prototype.isVisible = function(viewRect) {
	var rect2 = viewRect;
	    rect1 = this;
	    
	return base.core.TileMap.intersectRectangles({
		top:    rect1.y,
		left:   rect1.x,
		bottom: rect1.y + rect1.height,
		right:  rect1.x + rect1.width
	}, {
		top:    rect2.y,
		left:   rect2.x,
		bottom: rect2.y + rect2.width,
		right:  rect2.x + rect2.height
	});
}