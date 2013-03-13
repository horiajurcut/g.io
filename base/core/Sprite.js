var base = base || {};
    base.core = base.core || {};
    
base.core.Sprite = base.Class.$extend({
	__construct: function(params) {
		params = params || {};
		
		this.id = params.id || '';
		
		this.x = params.x || 0;
		this.y = params.y || 0;
		
		this.width = params.width || 0;
		this.height = params.height || 0;
		
		this.centerX = params.centerX || 0;
		this.centerY = params.centerY || 0;
	}
});