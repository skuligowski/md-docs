var docsServer = require('./server');


docsServer.start({
	playerSrc: 'player/dist',
	docsSrc: 'test/fixtures/rendered',
	port: 8000
});

