/**
 * 
 */
angular.module('TodoDirective', [])
	.directive('todoTable', function() {
		return {
//			restrict: 'A',		// A -> Attribute	=> <div todo-table></div>
//			restrict: 'E',		// E -> Element		=> <todo-table></todo-table>
			restrict: 'EA',		// EA -> Element/Attribute	=> Can use either form
			templateUrl: 'templates/directives/todo-table.html'
		}
	})
	.directive('todoNav', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/todo-nav.html'
		}
	})
;