angular.module('docsPlayer', [
	'ui.router',
	'book'
])

.provider('fastclick', function() {
	FastClick.attach(document.body);
	this.$get = function() {
        return {};
    };
})

.provider('runtimeStates', ['$stateProvider', function runtimeStates($stateProvider) {
  this.$get = [function() { 
    return { 
      addState: function(name, state) { 
        $stateProvider.state(name, state);
      }
    };
  }];
}])

.config(['$stateProvider', 'fastclickProvider', '$locationProvider', function($stateProvider, fastclickProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$stateProvider
	.state('main', {
		url: '/',
		templateUrl: 'tpl/empty',
		onEnter: function() {
			alert('main');
		}
	});

}])

.controller('AppCtrl', ['$scope', 'runtimeStates', '$http', '$location', '$state', function($scope, runtimeStates, $http, $location, $state) {

	$http.get('/docs/books.json').then(function(result) {
		var books = $scope.books = result.data,
			targetState = null;

		for(var i = 0; i < books.length; i++) {
			var book = books[i],
				chapters = book.chapters;
			for(var y = 0; y < chapters.length; y++) {
				var chapter = chapters[y],
					permalink = chapter.permalink;
				chapter.state = 'state'+i+'-'+y;
				runtimeStates.addState(chapter.state, {
					url: permalink,
					templateUrl: chapter.fileUrl
				});
				if (permalink === $location.url()) {
					targetState = chapter.state;
				}
			}
		}
		if (targetState) {
			$state.go(targetState);
		}
	});

}]);