var base = base || {};

base.Class = function() {
	var BaseClass = new Function(),
	    __LAZY__ = false;
	
	BaseClass.$extend = function(members) {
		var constructor = this,
		    definition, childMember, parentMember;
		
		if (members.__construct) {
			constructor = _buildMethod(members.__construct, this);
		}
		
		definition = function() {
			!__LAZY__ && constructor.apply(this, arguments);
		}
		
		for (var name in this) {
			definition[name] = this[name];
		}
		
		definition.prototype = _lazyInstance(this);
		
		for (var name in members) {
			if (name.match(/^__/)) continue;
			
			childMember  = members[name];
			parentMember = this.prototype[name];
			
			definition.prototype[name] = childMember instanceof Function ? _buildMethod(childMember, parentMember) : childMember;
		}
		
		definition.prototype.constructor = constructor;
		definition.prototype.$static = function() {
			return definition;
		}
		
		return definition;
	};
	
	function _lazyInstance(obj) {
		__LAZY__ = true;
		var newInstance = new obj();
		__LAZY__ = false;
		
		return newInstance;
	}
	
	function _buildMethod(childMember, parentMember) {
		return function() {
			var superMember = this.$super;
			
			this.$super = parentMember;
			returnValue = childMember.apply(this, arguments);
			this.$super = superMember;
				
			return returnValue;
		};
	}
	
	return BaseClass;
}()