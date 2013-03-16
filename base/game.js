window.onload = start;

function start() {
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var container = document.getElementById('main');
	var canvas = document.createElement('canvas');

	canvas.id = 'main';

	var ctx = canvas.getContext('2d');

	ctx.canvas.width  = SCREEN_WIDTH;
	ctx.canvas.height = SCREEN_HEIGHT;

	container.appendChild(canvas);

	var gameEngine = new base.core.GameEngine();

	gameEngine.mainContext = ctx;
	
	gameEngine.factory['Player'] = base.core.Player;
	gameEngine.factory['Enemy'] = base.core.Enemy;

	function _load() {
		var level = new base.core.Level();
		
		level.defineAssets([
			{
				src:   'resources/maps/grits.json',
				type:  'map'
			},
			{
				src:   'resources/maps/grits_effects.json',
				image: 'resources/images/grits_effects.png',
				type:  'atlas'
			}
		]);
		
		gameEngine.pushLevel('tutorial', level);
		
		gameEngine.currentLevel = 'tutorial';

		gameEngine.load(_init);	
	}

	function _init() {
		gameEngine.createEntity({
			type:             'Player',
			cycles:           ['walk_left', 'walk_right', 'walk_up', 'walk_down'],
			currentAnimation: 'walk_right'
		});
		
		_run();
	}

	function _run() {
		gameEngine.run();
		
		requestAnimationFrame(_run);
	}

	_load();	
}