angular.module('book', [
	'chapter'
])
.directive('book', function() {
	return {
		scope: {
			book: '='
		},
		replace: true,
		templateUrl: 'tpl/book',
		controller: ['$scope', 'chapterContext', function($scope, chapterContext) {
			$scope.expanded = false;
			$scope.toggleExpanded = function() {
				$scope.expanded = !$scope.expanded;
			}
			$scope.expand = function() {
				if (!$scope.expanded && chapterContext.getBook() === $scope.book) {
					$scope.expanded = true;
				}
			}			
			$scope.$watch(chapterContext.getBook, $scope.expand);
		}]
	}
})