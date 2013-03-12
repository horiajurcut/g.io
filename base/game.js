var engine = new base.core.Engine();

function initGame() {
	var map = new base.core.TileMap({
		resourceDir: 'resources/',
		path: 'maps/grits.json'
	});
	
	engine.map = map;
	
	var effects = new base.core.SpriteSheet({
		dataPath: 'resources/maps/grits_effects.json',
		imagePath: 'resources/images/grits_effects.png'
	});
	
	engine.pushSpriteSheet(effects);
}

function loadGame() {
	engine.preloadAssets(run);
}

var run = function runGame() {
	
}

initGame();