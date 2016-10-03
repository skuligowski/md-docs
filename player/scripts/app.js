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
		templateUrl: '/html/empty.html'
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
	};
})

.controller('AppCtrl', ['$scope', 'runtimeStates', '$http', '$location', '$state', 'chapterContext',
	function($scope, runtimeStates, $http, $location, $state, chapterContext) {

	var stateSeqId = 0;

	function makeNonBindable(html) {
		return '<div ng-non-bindable>' + html + '</div>';
	}

	function prepareChapter(book, chapter) {
		chapter.state = 'state' + (++stateSeqId);
		runtimeStates.addState(chapter.state, {
			url: chapter.permalink,
			fileUrl: chapter.fileUrl,
			data: {
				book: book,
				chapter: chapter
			},
			templateProvider: ['$q', '$http', function($q, $http) {
				var defer = $q.defer();
				$http.get(chapter.fileUrl).then(function(result) {
					defer.resolve(makeNonBindable(result.data));
				});
				return defer.promise;
			}]
		});
	}

	$http.get('/docs/books.json').then(function(result) {
		var books = $scope.books = result.data,
			targetState = null;

		for(var i = 0; i < books.length; i++) {
			var book = books[i],
				chapters = book.chapters;
			for(var y = 0; y < chapters.length; y++) {
				var chapter = chapters[y];
				prepareChapter(book, chapter);
				if (chapter.permalink === $location.path()) {
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
	};
}]);
