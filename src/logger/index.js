var colors = require('colors'),
	_ = require('lodash');
var LEVELS = {
	info: 		0x00001,
	debug: 		0x00002,
	error: 		0x00004,
	log: 		0x00008
},
	COLORS = {
		info:'green',
		debug:'yellow',
		error:'magenta',
		log:'cyan'

	};
module.exports = function(options){
	var Logger = function(opts){
		this.level = (opts.level?(_(opts.level.split(/ /)).
						map(function(e,m){
							return LEVELS[e] || 0;
						})
						.reduce(function(total,n){
							return total = total | n; 
						})):null) || (LEVELS.info | LEVELS.debug | LEVELS.error); 
	};

	Logger.prototype = {
		format:function(args){
			var args = Array.prototype.slice.call(arguments,0); 
			return args.join(''); 
		},
		log:function(type,args){
			var msg = args.join('');
			if (LEVELS[type] & this.level){
				console.log(colors[COLORS[type]](msg));
			}
		},
		debug:function(){
			this.log('debug',Array.prototype.slice.call(arguments,0));
		},
		info:function(){
			this.log('info',Array.prototype.slice.call(arguments,0));
		},
		error:function(){
			this.log('log',Array.prototype.slice.call(arguments,0));
		}
	};


	return new Logger(options||{});
};

module.exports.LEVELS = LEVELS;