var base = base || {};
    base.core = base.core || {};
    
base.core.TileMap = base.core.Map.$extend({
	tileSets: [],
	countXTiles: 100,
	countYTiles: 100,
	tileSize: {
		x: 64,
		y: 64
	},
	
	__construct: function(params) {
		this.$super(params);
	},
	
	parseMapData: function(map) {
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
				self.fullyLoaded = (self.imgLoadCount === self.tileSets.length);
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
		
		this.fullyLoaded = true;
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

base.core.TileMap.prototype.draw = function(context) {
	if (!this.fullyLoaded) return;
	
	for (var layerId = 0; layerId < this.mapData.layers.length; layerId++) {
		if (this.mapData.layers[layerId].type != 'tilelayer') continue;
		
		var layerData = this.mapData.layers[layerId].data;
		
		for (var tileId = 0; tileId < layerData.length; tileId++) {
			if (layerData[tileId] === 0) continue;
			
			var pkt = this.getTilePacket(layerData[tileId]);
			
			var worldX = Math.floor(tileId % this.countXTiles) * this.tileSize.x,
			    worldY = Math.floor(tileId / this.countXTiles) * this.tileSize.y;
			
			context.drawImage(
				pkt.img,
				pkt.px, pkt.py,
				this.tileSize.x, this.tileSize.y,
				worldX, worldY,
				this.tileSize.x, this.tileSize.y
			);
		}
	}
	
	//return context;
}