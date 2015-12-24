var Injector = require('./src/di/injector'); 

	var injector; 
	
		injector = new Injector(null,true); 
		injector.register('testServ',function testServ(logger,serv1){
			return {
				testServ:function(){
					return 'testserv'; 
				}
			};
		});

		injector.register('serv1',function testServ2(logger,testServ){
			return {
				testServ2:function(){
					return 'testserv2'; 
				}
			};
		});

		injector.register('servz',['logger','serv1','testServ',function testServx(logger,serv1,serv2){
			return {
				testServZ:function(){
					return serv1.testServ2()+" "+serv2.testServ(); 
				}
			};
		}]);

console.log(injector.get('servz'));