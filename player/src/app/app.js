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
		templateUrl: 'tpl/empty'
	});

}])

.factory('chapterContext', function() {
	var currentBook, currentChapter;
	return {
		set: function(book, chapter) {
			if (currentChapter)
				currentChapter.active = false;
			currentChapter = chapter;
			currentBook = book;
			currentChapter.active = true;
		},
		getBook: function() {
			return currentBook;
		},
		getChapter: function() {
			return currentChapter;
		}
	}
})

.controller('AppCtrl', ['$scope', 'runtimeStates', '$http', '$location', '$state', 'chapterContext',
	function($scope, runtimeStates, $http, $location, $state, chapterContext) {

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
					templateUrl: chapter.fileUrl,
					data: {
						book: book,
						chapter: chapter
					}
				});			
				if (permalink === $location.path()) {
					targetState = chapter.state;
				}
			}
		}
		$scope.$on('$stateChangeSuccess', function(event, toState) {
			chapterContext.set(toState.data.book, toState.data.chapter);
		});
		if (targetState) {
			$state.go(targetState, {}, {
				location: false
			});
		}
	});

}])

.directive('scrollWatcher', ['$window', '$anchorScroll', function($window, $anchorScroll) {
	return {
		link: function(scope, element) {
			scope.$on('$viewContentLoaded', $anchorScroll);
			scope.$watch(function() { return $window.location.hash }, function(hash) {
				if (!hash) {
					element.scrollTop(0);
				}
			});
		}
	}
}])