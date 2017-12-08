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
	.controller('TodoController', function($scope, TodoAPIService, store, $location) {
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
	            console.log("Error retrieving the ToDo list :  ");
	            console.log(err);
	        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push(angular.copy($scope.todo));
 
                TodoAPIService.createToDo(todoURL, $scope.todo, $scope.authToken)
	                .then(function(results) {
	                	console.log("ToDo item created");
	                    console.log(results);
	                    $scope.todo.title = "";
	                    $scope.todo.description = "";
	                    $scope.todo.status = "";
	                }).catch(function(err) {
	                    console.log("Error creating a ToDo item :");
	                	console.log(err);
	                });
            }
        }
        
        $scope.editToDo = function(id) {
        	$location.path('/todo/edit/' + id);
        };
        
        $scope.deleteToDo = function(id) {
        	var URL = "https://morning-castle-91468.herokuapp.com/";
        	var deleteUrl = URL + "todo/" + id;
        	
        	TodoAPIService.getToDos(deleteUrl, $scope.username, store.get('authToken'))
        		.then(function(results) {
        			$scope.todo = results.data;
        		})
        		.catch(function(err) {
        			console.log("Error retrieving todo #" + id);
        			console.log(err);
        		})
        	;
        	
        	TodoAPIService.deleteToDo(todoURL + id, $scope.username, $scope.authToken)
        		.then(function(results) {
        			console.log("ToDo item #" + id + " deleted");
        			console.log(results);
        			/*console.log("----");
        			console.log("$scope.todo element");
        			console.log($scope.todo);*/
        			// Delete this ToDo item from the list also
        			$scope.todos = $scope.todos.filter(e => e.id != id);
        			
        			/*console.log("$scope.todos array :");
        			console.log($scope.todos);*/
        		})
        		.catch(function(err) {
        			console.log("Error deleting ToDo item");
        			console.log(err);
        		})
        	;
        };
        
    })
    .controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
    	var id = $routeParams.id;
    	console.log("The id for this ToDo :  " + id);
    	var URL = "https://morning-castle-91468.herokuapp.com/";
    	var editUrl = URL + "todo/" + id;
    	
    	TodoAPIService.getToDos(editUrl, $scope.username, store.get('authToken'))
    		.then(function(results) {
    			$scope.todo = results.data;
    		})
    		.catch(function(err) {
    			console.log("Error retrieving todo #" + id);
    			console.log(err);
    		})
    	;
    	
    	$scope.submitForm = function() {
    		if($scope.todoForm.$valid) {
    			$scope.todo.username = $scope.username;
    			
    			TodoAPIService.editToDo(editUrl, $scope.todo, store.get('authToken'))
    				.then(function(results) {
    					$location.path("/todo");
    				})
    				.catch(function(err) {
    					console.log("Error editing todo :");
    					console.log(err);
    				})
    			;
    		}
    	};
    })
    ;
;