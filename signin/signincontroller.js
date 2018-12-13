myApp.controller("SigninController", ["$scope", "$state", "Auth", 
  function($scope, $state, Auth) {
    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.register = function() {
        $scope.auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function() {
            console.log('Compte créé !');
            $state.go("mainpage");
        }).catch(function(error) {
            console.log("Authentication failed:", error);
        }); 
    }
  }
]);