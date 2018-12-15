
myApp.controller('MainpageController', ["$scope", "$state", "$http", "Auth", "$firebaseArray",'$rootScope', '$compile',

  function($scope, $state,$http, Auth, $firebaseArray, $rootScope, $compile) {

  	$scope.auth = Auth;
  	var user; 

  	$scope.latitude = 48.858370;
  	$scope.longitude = 2.294481;

  	var picturesRef;
    var pictures;

  	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
      user = firebaseUser;
      console.log(user);
      picturesRef = firebase.database().ref().child("user").child(user.uid);
      pictures = $firebaseArray(picturesRef);
    });

  	var venuesResult;

  	var mapOptions = {
	      zoom: 5,
	      center: new google.maps.LatLng(47,2),
	      mapTypeId: google.maps.MapTypeId.TERRAIN
	  }

	  $scope.addPic = function(url) {
	  	console.log(url);
	  	pictures.$add({
	  		url: url
	  	})
	  	console.log(pictures);
	  }

	  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	  $scope.markers = [];
	  
	  var infoWindow = new google.maps.InfoWindow();
	  
	  var createMarker = function (value, urlIcon, urlPic){
	      
	      var marker = new google.maps.Marker({
	          map: $scope.map,
	          position: new google.maps.LatLng(value.location.lat, value.location.lng),
	          title: value.name,
	          icon: urlIcon
	      });
	      marker.content = '<img style="border: 3px solid white;" src=' + urlPic + ' alt="" class="center-block">';
	      var content = '<a style="margin-top: 10px; margin-right: 0px;" class="btn btn-secondary" type="button" class="btn btn-secondary" ng-click="addPic(' + '\'' + urlPic.toString() + '\'' + ')">Sauvegarder cette photo !</a>';
	      var content2 = '<div>' + '<h2>' + marker.title + '</h2>' + content + marker.content + '</div>';
	      var compiledContent = $compile(content2)($scope);
	      google.maps.event.addListener(marker, 'click', (function(marker,content, scope) {
	      	return function() {
	          infoWindow.setContent(content);
	          infoWindow.open($scope.map, marker);
	        }
	      })(marker, compiledContent[0], $scope));
	      
	      $scope.markers.push(marker);
	      
	  }  
	  

      $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
      }
  	

    console.log('Bienvenue sur la page d\'accueil!');

    
    $scope.signOut = function() {
    	$scope.auth.$signOut();
    	$state.go("home");
    }

    $scope.getLocation = function() {
    	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var client_token;
            infoWindow.setPosition(pos);
            var posMarker = new google.maps.Marker({
            	map: $scope.map,
			    position: new google.maps.LatLng(pos.lat, pos.lng),
			    icon: {
			      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
			      scale: 5
			    }
			});
			$scope.markers.push(posMarker);
            
            $scope.map.setCenter(pos);
            $scope.map.setZoom(13);
            $http({
			    url: "https://api.foursquare.com/v2/venues/search", 
			    method: "GET",
			    params: {
			    	ll: pos.lat + "," + pos.lng,
			    	client_id: "ZOVEPTIE0BYQJZLDYWFHHEDRB2QOP5KSISAGA1UVKGPIDYYS",
			    	client_secret: "5NPWXXBACN35EF3CKR1CBULJAMMJ5Z3L5AN3KNYGHZXCYTWA",
			    	v: "20131124"
			    }
			}).then(function(response) {
				console.log(response);
				venuesResult = response.data.response.venues;
				console.log(venuesResult);
				
				angular.forEach(venuesResult, function(value, key) {
					$http({
					    url: "https://api.foursquare.com/v2/venues/" + value.id + "/photos", 
					    method: "GET",
					    params: {
					    	client_id: "ZOVEPTIE0BYQJZLDYWFHHEDRB2QOP5KSISAGA1UVKGPIDYYS",
					    	client_secret: "5NPWXXBACN35EF3CKR1CBULJAMMJ5Z3L5AN3KNYGHZXCYTWA",
					    	v: "20131124"
					    }
					}).then( function(response) {
						console.log(response);
						if(response.data.response.photos.count > 0) {
							var pictureURL = response.data.response.photos.items[0].prefix + 500 + "x" + 500 + response.data.response.photos.items[0].suffix; 
							var picIconURL = response.data.response.photos.items[0].prefix + 50 + "x" + 50 + response.data.response.photos.items[0].suffix;
							
							createMarker(value, picIconURL, pictureURL);
						}
					})
					
				});
			});

			//355ce8e40dc948aab94ea6d7b2f70835
          }, function() {
            handleLocationError(true, infoWindow, $scope.map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, $scope.map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    $scope.simulateLocation = function() {
    	
        var pos = {
          lat: $scope.latitude,
          lng: $scope.longitude
        };

        var client_token;
        infoWindow.setPosition(pos);
        var posMarker = new google.maps.Marker({
        	map: $scope.map,
		    position: new google.maps.LatLng(pos.lat, pos.lng),
		    icon: {
		      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
		      scale: 5
		    }
		});
		$scope.markers.push(posMarker);
        
        $scope.map.setCenter(pos);
        $scope.map.setZoom(13);
        $http({
		    url: "https://api.foursquare.com/v2/venues/search", 
		    method: "GET",
		    params: {
		    	ll: pos.lat + "," + pos.lng,
		    	client_id: "ZOVEPTIE0BYQJZLDYWFHHEDRB2QOP5KSISAGA1UVKGPIDYYS",
		    	client_secret: "5NPWXXBACN35EF3CKR1CBULJAMMJ5Z3L5AN3KNYGHZXCYTWA",
		    	v: "20131124"
		    }
		}).then(function(response) {
			console.log(response);
			venuesResult = response.data.response.venues;
			console.log(venuesResult);
			
			angular.forEach(venuesResult, function(value, key) {
				$http({
				    url: "https://api.foursquare.com/v2/venues/" + value.id + "/photos", 
				    method: "GET",
				    params: {
				    	client_id: "ZOVEPTIE0BYQJZLDYWFHHEDRB2QOP5KSISAGA1UVKGPIDYYS",
				    	client_secret: "5NPWXXBACN35EF3CKR1CBULJAMMJ5Z3L5AN3KNYGHZXCYTWA",
				    	v: "20131124"
				    }
				}).then( function(response) {
					console.log(response);
					if(response.data.response.photos.count > 0) {
						var pictureURL = response.data.response.photos.items[0].prefix + 500 + "x" + 500 + response.data.response.photos.items[0].suffix; 
						var picIconURL = response.data.response.photos.items[0].prefix + 50 + "x" + 50 + response.data.response.photos.items[0].suffix;
						
						createMarker(value, picIconURL, pictureURL);
					}
				})
				
			});
		});
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

  }
]);