myApp.controller("LikesController", ["$scope", "$state", "Auth", "$firebaseArray", 
  function($scope, $state, Auth, $firebaseArray) {
    $scope.auth = Auth;
    var user; 

    var picturesRef;
    var pictures;

    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      user = firebaseUser;
      console.log(user);
      picturesRef = firebase.database().ref().child("user").child(user.uid);
      $scope.pictures = $firebaseArray(picturesRef);
      console.log($scope.pictures);
    });

    
  }
]);