module.exports = {
	modulePaths: [
		'<rootDir>/../test/',
		'<rootDir>/../server/',
		'<rootDir>/../client/',
		'<rootDir>/../client/extensions/',
	],
	testEnvironment: 'node',
	testMatch: [ '**/test/*.js?(x)' ],
	timers: 'fake',
	verbose: true,
};
