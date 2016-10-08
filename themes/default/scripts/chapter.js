angular.module('chapter', [])
.directive('chapter', function() {
	return {
		scope: {
			chapter: '='
		},
		replace: true,
		templateUrl: '/html/chapter.html',
		controller: ['$scope', 'chapterContext', '$window', function($scope, chapterContext, $window) {
			$scope.expanded = false;			
			$scope.toggleExpanded = function() {
				$scope.expanded = !$scope.expanded;
			}
			$scope.isBookmarkActive = function(bookmark) {
				return $window.location.pathname === $scope.chapter.permalink
					&& $window.location.hash === '#' + bookmark.ref;
			}
			$scope.isChapterActive = function(chapter) {
				return $window.location.pathname === $scope.chapter.permalink && !$window.location.hash;
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