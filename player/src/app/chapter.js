angular.module('chapter', [])
.directive('chapter', function() {
	return {
		scope: {
			chapter: '='
		},
		replace: true,
		templateUrl: 'tpl/chapter',
		controller: ['$scope', '$state', function($scope, $state) {
			$scope.expanded = $state.is($scope.chapter.state);			
			$scope.selectChapter = function() {
				$scope.expanded = !$scope.expanded;
				$state.go($scope.chapter.state);
			}
		}]
	}
});