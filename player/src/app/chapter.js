angular.module('chapter', [])
.directive('chapter', function() {
	return {
		scope: {
			chapter: '='
		},
		replace: true,
		templateUrl: 'tpl/chapter',
		controller: ['$scope', 'chapterContext', '$window', function($scope, chapterContext, $window) {
			$scope.expanded = false;			
			$scope.toggleExpanded = function() {
				$scope.expanded = !$scope.expanded;
			}
			$scope.isBookmarkActive = function(bookmark) {
				return $window.location.hash.indexOf(bookmark.ref) > -1;
			}
			$scope.isChapterActive = function(chapter) {
				return $window.location.pathname.indexOf(chapter.ref) > -1 && !$window.location.hash;
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