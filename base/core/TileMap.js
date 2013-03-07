var base = base || {};
    base.core = base.core || {};
    
base.core.TileMap = base.core.Map.$extend({
	tileSets: [],
	canvasTiles: [],
	countXTiles: 100,
	countYTiles: 100,
	tileSize: {
		x: 64,
		y: 64
	},
	canvasTileSize: {
		x: window.innerWidth,
		y: window.innerHeight
	},
	viewRect: {
		x: 1024,
		y: 1024,
		width: window.innerWidth,
		height: window.innerHeight
	},
	
	__construct: function(params) {
		this.$super(params);
	},
	
	parseMapData: function(map, callback) {
		var self = this;
		
		this.$super(map);
		
		this.countXTiles = this.mapData.width;
		this.countYTiles = this.mapData.height;
		
		this.tileSize.x =  this.mapData.tilewidth;
		this.tileSize.y =  this.mapData.tileheight;
		
		this.mapPixelSize.x = this.countXTiles * this.tileSize.x;
		this.mapPixelSize.y = this.countYTiles * this.tileSize.y;
		
		for (var i = 0; i < this.mapData.tilesets.length; i++) {
			var newImg = new Image();
			
			newImg.onload = function() {
				self.imgLoadCount++;
				(self.imgLoadCount === self.tileSets.length) && self.preDrawCache(callback);
			}
			
			newImg.src = this.resourceDir + 'images/' + this.mapData.tilesets[i].image.replace(/^.*[\\\/]/, '');
			
			var ts = {
				firstgid: this.mapData.tilesets[i].firstgid,
				name: this.mapData.tilesets[i].name,
				image: newImg,
				imageWidth: this.mapData.tilesets[i].imagewidth,
				imageHeight: this.mapData.tilesets[i].imageheight,
				countXTiles: Math.floor(this.mapData.tilesets[i].imagewidth / this.tileSize.x),
				countYTiles: Math.floor(this.mapData.tilesets[i].imageheight / this.tileSize.y)
			};
			
			this.tileSets.push(ts);
		}
	}
});

base.core.TileMap.prototype.getTilePacket = function(tileIndex) {
	var pkt = {
		image: null,
		px: 0,
		py: 0
	}
	
	for (var i = this.tileSets.length - 1; i >= 0; i--) {
		if (this.tileSets[i].firstgid <= tileIndex) break;
	}
	
	var localId = tileIndex - this.tileSets[i].firstgid,
	    localTileX = Math.floor(localId % this.tileSets[i].countXTiles),
	    localTileY = Math.floor(localId / this.tileSets[i].countXTiles);
	
	pkt.img = this.tileSets[i].image;
	pkt.px = localTileX * this.tileSize.x;
	pkt.py = localTileY * this.tileSize.y;
	
	return pkt;
}

base.core.TileMap.prototype.centerAt = function(x, y, canvasWidth, canvasHeight) {
	this.viewRect.width = canvasWidth;
	this.viewRect.height = canvasHeight;
	this.viewRect.x = x - (canvasWidth / 2);
	this.viewRect.y = y - (canvasHeight / 2);
}

base.core.TileMap.intersectRectangles = function(rect1, rect2) {
	return !(rect2.left > rect1.right || rect2.right < rect1.left ||
		     rect2.top > rect1.bottom || rect2.bottom < rect1.top);
}

base.core.TileMap.prototype.preDrawCache = function(callback) {
	var xCanvasCount = 1 + Math.floor(this.mapPixelSize.x / this.canvasTileSize.x);
	var yCanvasCount = 1 + Math.floor(this.mapPixelSize.y / this.canvasTileSize.y);
	
	for (var rows = 0; rows < yCanvasCount; rows++) {
		for (var columns = 0; columns < xCanvasCount; columns++) {
			var ct = new base.core.CanvasTile();
			
			ct.create(this.canvasTileSize.x, this.canvasTileSize.y);
			ct.x = columns * this.canvasTileSize.x;
			ct.y = rows * this.canvasTileSize.y;
			
			this.canvasTiles.push(ct);
			this.drawCanvasTile(ct);
		}
	}
	
	this.fullyLoaded = true;
	callback.apply(this);
}

base.core.TileMap.prototype.drawCanvasTile = function(canvasTile) {
	var context = canvasTile.context;
	context.fillRect(0, 0, canvasTile.width, canvasTile.height);
	
	var viewRectangle = {
		top:    canvasTile.y,
		left:   canvasTile.x,
		bottom: canvasTile.y + canvasTile.height,
		right:  canvasTile.x + canvasTile.width
	}
	
	for (var layerId = 0; layerId < this.mapData.layers.length; layerId++) {
		if (this.mapData.layers[layerId].type != 'tilelayer') continue;
		
		var layerData = this.mapData.layers[layerId].data;
		
		for (var tileId = 0; tileId < layerData.length; tileId++) {
			if (layerData[tileId] === 0) continue;
			
			var pkt = this.getTilePacket(layerData[tileId]);
			
			var worldX = Math.floor(tileId % this.countXTiles) * this.tileSize.x,
			    worldY = Math.floor(tileId / this.countXTiles) * this.tileSize.y;
			
			var visible = base.core.TileMap.intersectRectangles(viewRectangle, {
				top:    worldY,
				left:   worldX,
				bottom: worldY + this.tileSize.y,
				right:  worldX + this.tileSize.x
			});
			
			if (!visible) continue;
		
			worldX -= viewRectangle.left;
			worldY -= viewRectangle.top;
			
			context.drawImage(
				pkt.img,
				pkt.px, pkt.py,
				this.tileSize.x, this.tileSize.y,
				worldX, worldY,
				this.tileSize.x, this.tileSize.y
			);
		}
	}
}

base.core.TileMap.prototype.draw = function(context) {
	if (!this.fullyLoaded) return;
	
	for (var i = 0; i < this.canvasTiles.length; i++) {
		var ct = this.canvasTiles[i];
		
		console.log(ct);
		if (ct.isVisible(this.viewRect)) {
			context.drawImage(ct.canvasHandle, ct.x - this.viewRect.x, ct.y - this.viewRect.y);
		}
	}
}