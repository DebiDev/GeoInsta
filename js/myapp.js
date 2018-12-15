var myApp = angular.module('myApp', ['ui.router', 'firebase']);

myApp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

myApp.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
            zoom: 13,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

myApp.controller('newPlaceCtrl', function($scope, Map, Auth) {
    
    $scope.place = {};
    
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
    	$scope.firebaseUser = firebaseUser;
    });
	
    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { // success
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    }
    
    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
    }
    
    Map.init();
});

myApp.controller("detectUserCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });
	  
	$scope.signOut = function() {
    	$scope.auth.$signOut();
    	$state.go("home");
    }
  }
]);

myApp.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider

    .state('home', {
       url: '/home',
       templateUrl: 'home/home.html'
    })

    .state('signin', {
      url: '/signin',
      templateUrl: 'signin/signin.html'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'login/login.html'
    })

    .state('mainpage', {
      url: '/mainpage',
      templateUrl: 'mainpage/mainpage.html'
    })

    .state('page2', {
       url: '/page2',
       templateUrl: 'page2/page2.html'
    });

    $urlRouterProvider.otherwise('home');

});