myApp.controller("LoginController", ["$scope", "$state", "Auth", 
  function($scope, $state, Auth) {
    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.login = function() {
    	$scope.auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function() {
    		console.log('Vous êtes connecté !');
        $state.go("mainpage");
    	}).catch(function(error) {
	      	console.log("Authentication failed:", error);
	    });
    	
    }
  }
]);