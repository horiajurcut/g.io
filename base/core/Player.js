var base = base || {};
    base.core = base.core || {};
    
base.core.Player = base.core.Entity.$extend({
	__construct: function() {
		this.$super();
	},
	
	update: function() {
		this.$super();
	}
});