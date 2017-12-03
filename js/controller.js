angular.module('RouteControllers', [])
	.controller('HomeController', function($scope) {
		$scope.title = "Welcome to Angular ToDo";
	})
	.controller('RegisterController', function($scope, UserAPIService, store) {
		$scope.registrationUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.login = function() {
			UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data)
			.then(function(results) {
				$scope.token = results.data.token;
				store.set('username', $scope.registrationUser.username);
				store.set('authToken', $scope.token);
			})
			.catch(function(err) {
				console.log(err.data);
			})
			;
		}

		$scope.submitForm = function() {
			if($scope.registrationForm.$valid) {
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;

				UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser)
				.then(function(results) {
                    $scope.data = results.data;
                    alert("You have successfully registered to Angular Todo");
                    $scope.login();
                })
                .catch(function(err) {
                    alert("Oops! Something went wrong!");
                    console.log(err);
                })
                ;

			}

			console.log($scope.registrationUser.username + "  " +
				$scope.registrationUser.password);
		};
	})
	.controller('TodoController', function($scope, TodoAPIService, store) {
        var URL = "https://morning-castle-91468.herokuapp.com/";
        var todoURL = URL + "todo/";
        
        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
 
        $scope.todos = [];
 
        TodoAPIService.getToDos(todoURL, $scope.username, $scope.authToken)
	        .then(function(results) {
	            $scope.todos = results.data || [];
	            console.log("ToDo list :  ");
	            console.log($scope.todos);
	        }).catch(function(err) {
	            console.log("Error :  ");
	            console.log(err);
	        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push(angular.copy($scope.todo));
 
                TodoAPIService.createToDo(todoURL, $scope.todo, $scope.authToken)
	                .then(function(results) {
	                    console.log(results);
	                    $scope.todo.title = "";
	                    $scope.todo.description = "";
	                    $scope.todo.status = "";
	                }).catch(function(err) {
	                    console.log("Error :");
	                	console.log(err);
	                });
            }
        }
        
    });
	;