var fs = require('fs');
module.exports = function cleanFileGenerator(){
	return {
		generate:function(file,outputFile){
			fs.writeFileSync(outputFile,file); 
		}
	};
};