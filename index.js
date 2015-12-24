var Scenario = require('./src/generator'),
	path = require('canonical-path');

var scenario = new Scenario({
	inputFolder:path.resolve('./dev'),
	outputFolder:path.resolve('./generated')
}); 

scenario.processor('tagsExtractor',require('./src/io/tagsExtractor'));
	// .processor('cleanFileGenerator',require('./src/io/cleanFileGenerator')); 

scenario.run(); 
