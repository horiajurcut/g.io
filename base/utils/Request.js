var base = base || {};
	base.utils = base.utils || {};
	
base.utils.Request = function(options) {
	this.method = options.method == undefined ? 'GET' : options.method;
	this.URI    = options.url;
	this.type   = options.type;
	this.async  = options.async == undefined ? true : options.async;
	
	this.data   = null;
	
	if (options.data != undefined && typeof options.data === 'object') {
		this.data = options.data;
	}
	
	this.xhr = new XMLHttpRequest();
	
	if (this.type != undefined) {
		this.xhr.responseType = this.type;
	}
	
	this.xhr.onload = function() {
		(options.success == undefined ? function(response) {} : options.success)(this.response);
	}
};

base.utils.Request.prototype.send = function() {
	var payload = null;

	if (this.method == 'POST') {
		payload = new FormData();
		
		for (key in this.data) {
			payload.append(key, this.data[key]);
		}
	}
	
	if (this.method == 'GET') {
		var query = [],
			params = '';
		
		for(key in this.data) {
			query.push(encodeURIComponent(key) + "=" + encodeURIComponent(this.data[key]));
		}
		
		params = '?' + query.join('&');
		this.URI += params;
	}

	this.xhr.open(this.method, this.URI, this.async);
	this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	this.xhr.send(payload);
}