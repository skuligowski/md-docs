angular.module('chapter', [])
.directive('chapter', function() {
	return {
		scope: {
			chapter: '='
		},
		replace: true,
		templateUrl: 'html/chapter.html',
		controller: ['$scope', 'chapterContext', '$window', '$state', function($scope, chapterContext, $window, $state) {
			$scope.expanded = false;			
			$scope.toggleExpanded = function() {
				$scope.expanded = !$scope.expanded;
			}
			$scope.isBookmarkActive = function(bookmark) {
				return $state.current.url === $scope.chapter.permalink
					&& $window.location.hash === '#' + bookmark.ref;
			}
			$scope.isChapterActive = function(chapter) {
				return $state.current.url === $scope.chapter.permalink && !$window.location.hash;
			}			
			$scope.expand = function() {				
				if (!$scope.expanded && chapterContext.getChapter() === $scope.chapter) {
					$scope.expanded = true;
				}
			}
			$scope.$watch(chapterContext.getChapter, $scope.expand);

		}]
	}
});
