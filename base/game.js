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

	var level = new base.core.Level();

	level.mainContext = ctx;

	function _init() {
		level.defineAssets([
			{
				src:   'resources/maps/grits.json',
				type:  'map'
			},
			{
				src:   'resources/maps/grits_effects.json',
				image: 'resources/images/grits_effects.png',
				type:  'sheet'
			}
		]);

		level.load(_run);	
	}

	function _run() {
		level.run();
		
		requestAnimationFrame(_run);
	}

	_init();	
}