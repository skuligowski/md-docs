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
		controller: ['$scope', function($scope) {
			$scope.expanded = false;
			$scope.toggleExpanded = function() {
				console.log('toggle')
				$scope.expanded = !$scope.expanded;
			}
		}],
		link: function() {
			console.log('book')
		}
	}
})