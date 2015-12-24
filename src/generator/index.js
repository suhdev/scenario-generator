var Injector = require('../di/injector'),
	Logger = require('../logger')(),
	fs = require('fs'),
	path = require('canonical-path'),
	_ = require('lodash'),
	mkdirp = require('mkdirp');

var ScenarioGenerator = function ScenarioGenerator(opts){
	this.inputFolder = opts.inputFolder;
	this.outputFolder = opts.outputFolder || path.resolve('./','build'); 
	this.injector = new Injector(Logger);
	this.injector.register('logger',Logger);
	this.services = [];
	this.processors = [];
};

ScenarioGenerator.prototype = {
	processor:function(name,fn){
		this.processors.push(name); 
		this.injector.register(name,fn); 
		return this;
	},
	service:function(name,fn){
		this.services.push(name);
		this.injector.register(name,fn);
		return this;
	},
	run:function(){
		var self = this;
		if(!fs.exists(this.outputFolder)){
			mkdirp(this.outputFolder); 
		}
		fs.readdir(this.inputFolder,function(err,files){
			if (err){
				throw err;
				return;
			}
			_(files)
				.forEach(function(e){
					var outputFile = path.basename(e),
						processed = fs.readFileSync(path.resolve(self.inputFolder,e)).toString(); 
					_(self.processors)
						.forEach(function(e){
							processed = self.injector.get(e).process(processed); 
						})
						.commit();

					fs.writeFileSync(path.resolve(self.outputFolder,outputFile),processed);
				})
				.commit();
		});
	}
};

module.exports = ScenarioGenerator; 