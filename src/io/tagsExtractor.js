var dom = require('cheerio'); 
module.exports = function tagsExtractor(){
	var REGEX = '.*?".*?"';
	var PREFIX = 'gn\-'; 
	return {
		setPrefix:function(p){
			PREFIX = p;
		},
		process:function(file){
			var $ = dom.load(file); 
			$('.gogole [][][].test')
			var tags = [],
			cleanFile = file.replace(new RegExp(PREFIX+REGEX,'ig'),function(v,m){
				tags.push(v); 
				return '';
			});
			// exampleGenerator.process(tags); 
			return cleanFile;
		}
	};
};