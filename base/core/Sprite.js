var base = base || {};
    base.core = base.core || {};
    
base.core.Sprite = base.Class.$extend({
	id: '',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	centerX: 0,
	centerY: 0,
	
	__construct: function(params) {
		this.id = params.id || '';
		
		this.x = params.x || 0;
		this.y = params.y || 0;
		
		this.width = params.width || 0;
		this.height = params.height || 0;
		
		this.centerX = params.centerX || 0;
		this.centerY = params.centerY || 0;
	}
});