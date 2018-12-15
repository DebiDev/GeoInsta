myApp.controller("HomeController", ["$scope","$state", "Auth", 
  function($scope, $state, Auth) {
    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.goToSignin = function() {
    	$state.go("signin");
    }

    $scope.goToLogin = function() {
    	$state.go("login");
    }
	
	$scope.signOut = function() {
    	$scope.auth.$signOut();
    	$state.go("home");
    }

    $scope.goToMainpage = function() {
    	$state.go("mainpage");
    }
	
  }
]);
