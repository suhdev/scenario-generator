var _ = require('lodash'),
	log = require('../logger')({level:'info log error'});
var Injector = function Injector(logger,strict){
	this.injectables = {};
	this.components = {}; 
	this.logger = logger || log;
	this.injectables['logger'] = this.logger; 
	this.strict = strict || false;
	this.stack = [];
	
};

Injector.prototype = {
	register:function(name,generator){
		var n = _.isString(name)?name:((name.name)?name.name:((_.isFunction(generator) && generator.name)?generator.name:(_.isArray(name)?(name[name.length-1].name):null))),
			fn = generator || name;
		this.logger.info('Component name: '+n);
		this.logger.debug('Component generator: '+fn);
		if (!_.isString(n)){
			this.logger.error('Component has no name',n);
			throw new Error('Component has no name'); 
		}
		if (!fn){
			this.logger.error('No injectable provided');
			throw new Error('No injectable provided'); 
		}
		if (!_.isFunction(fn) && !_.isArray(fn)){
			this.injectables[name] = fn; 
		}else {
			this.components[n] = fn;
		}
		return this;
	},
	get:function(name){
		var i;
		if ((i = this.stack.indexOf(name)) != -1){
			var z = this.stack.slice(i).join(' -> ');
			this.logger.error('Circular dependency '+z+' -> '+name);
			throw new Error('Circular dependency '+z+' -> '+name);
			return;
		}
		this.stack.push(name); 
		if (this.injectables[name]){
			this.stack.pop();
			return this.injectables[name]; 
		}else if (this.components[name]){
			var deps = this.getDependencies(this.components[name],name),
				comp = this.components[name],
				fn = _.isArray(comp)?comp[comp.length-1]:comp;
			this.stack.pop();
			return this.injectables[name] = fn.apply(this,deps); 
		}else {
			this.logger.error('Component `'+name+'` is not registered.');
			throw new Error('Component `'+name+'` is not registered.');
		}

	},
	getDependencies:function(comp,name){
		var fn,deps =[],fnName,t,self=this,depsObjs=[],params; 
		if (_.isArray(comp)){
			deps = comp.slice(0,comp.length-1);
			fn = comp[comp.length-1]; 
			fnName = name; 
		}else {
			fnName = name; 
			t = comp.toString();
			params = t.match(/\(([\S]*?)\)/); 
			deps = [];
			if (params && params.length > 0 
				&& params[1] !== ''){
				deps = params[1].split(/,/); 
			}
		}
		if (deps.length > 0){
			_(deps)
				.forEach(function(e,v){
					try{
						depsObjs.push(self.get(e));
					}catch(err){
						if (self.strict){
							// this.logger
							throw err;
							// throw new Error('Component `'+fnName+'` could not be instanitated because one of its dependencies could not be found: '+err.message);
						}else {
							self.logger.error('Component `'+fnName+'` could not be instanitated because one of its dependencies could not be found: '+err.message);
							
						}
					}
				}).value();

		}
		return depsObjs;
	}

};

module.exports = Injector;