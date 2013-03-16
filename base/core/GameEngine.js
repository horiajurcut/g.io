var base = base || {};
    base.core = base.core || {};
    
base.core.GameEngine = base.Class.$extend({
	__construct: function() {
		this.mainContext   = null;
		
		this.levels        = {};
		this.levelCount    = 0;
		this.factory       = {};
		
		this.entities      = [];
		this._deferredKill = [];
		
		this.loadCount     = 0;
		this.errorCount    = 0;
		this.loadCallback  = null;
		
		this.currentLevel  = null;
		this.fullyLoaded   = false;
	}
});

base.core.GameEngine.prototype.load = function(callback) {
	this.loadCallback = callback;
	
	for (levelName in this.levels) {
		this.levels[levelName].load(this);
	}
}

base.core.GameEngine.prototype.loadCompleted = function() {
	this.loadCount += 1;
	
	if (this.loadCount == this.levelCount) {
		this.fullyLoaded = true;
		this.loadCallback();	
	}
}

base.core.GameEngine.prototype.run = function() {
	this.draw();
}

base.core.GameEngine.prototype.update = function() {
	for (var i = 0; i < this.entities.length; i++) {
		if (!this.entities[i]._killed) {
			this.entities.update();	
		} else {
			this._deferredKill.push(this.entities[i]);
		}
	}
	
	for (var i = 0; i < this._deferredKill.length; i++) {
		// Remove killed entity from entities list
	}
	
	this._deferredKill = [];
}

base.core.GameEngine.prototype.draw = function() {
	var map = this.levels[this.currentLevel].map,
	    ctx = this.mainContext;
	
	map.draw(ctx);
	
	// Draw entities
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(ctx);
	}

 //    // Bucket entities by zIndex
 //    var fudgeVariance = 128;
 //    var zIndex_array = [];
 //    var entities_bucketed_by_zIndex = {};
 //    gGameEngine.entities.forEach(function(entity) {
 //        //don't draw entities that are off screen
 //        if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
 //           entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
 //           entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
 //           entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {
 //            // Bucket the entities in the entities list by their zindex
 //            // property.
 //            entities_bucketed_by_zIndex[entity.zindex] = entity;
 //        }
 //    });

    // Draw entities sorted by zIndex
}

base.core.GameEngine.prototype.createEntity = function(settings) {
	var entity = null;
	
	entity = new this.factory[settings.type]();
	
	for (var i = 0; i < settings.cycles.length; i++) {
		var anim = new base.core.SpriteSheetAnimation();
		
		for(var frame = 0; frame < 10; frame++) {
			anim.pushFrame(settings.cycles[i] + '_000' + frame + '.png');
		}

		for(var frame = 10; frame < 30; frame++) {
			anim.pushFrame(settings.cycles[i] + '_00' + frame + '.png');
		}
		
		anim.spriteSheet = this.levels[this.currentLevel].spriteSheets[0];
		
		entity.animations[settings.cycles[i]] = anim;
		entity.currentAnimation = settings.currentAnimation;
	}
	
	this.entities.push(entity);
	
	return entity;
}

base.core.GameEngine.prototype.removeEntity = function() {
	
}

base.core.GameEngine.prototype.pushLevel = function(levelName, level) {
	this.levelCount += 1;
	this.levels[levelName] = level;
}