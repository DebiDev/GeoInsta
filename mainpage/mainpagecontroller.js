myApp.controller('MainpageController', ["$scope", "$state", "$http", "Auth",

  function($scope, $state,$http,  Auth) {
  	var cities = [
              {
                  city : 'India',
                  desc : 'This is the best country in the world!',
                  lat : 23.200000,
                  long : 79.225487
              },
              {
                  city : 'New Delhi',
                  desc : 'The Heart of India!',
                  lat : 28.500000,
                  long : 77.250000
              },
              {
                  city : 'Mumbai',
                  desc : 'Bollywood city!',
                  lat : 19.000000,
                  long : 72.90000
              },
              {
                  city : 'Kolkata',
                  desc : 'Howrah Bridge!',
                  lat : 22.500000,
                  long : 88.400000
              },
              {
                  city : 'Chennai  ',
                  desc : 'Kathipara Bridge!',
                  lat : 13.000000,
                  long : 80.250000
              }
          ];

  	$scope.auth = Auth;

  	var mapOptions = {
	      zoom: 4,
	      center: new google.maps.LatLng(25,80),
	      mapTypeId: google.maps.MapTypeId.TERRAIN
	  }

	  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	  $scope.markers = [];
	  
	  var infoWindow = new google.maps.InfoWindow();
	  
	  var createMarker = function (info){
	      
	      var marker = new google.maps.Marker({
	          map: $scope.map,
	          position: new google.maps.LatLng(info.lat, info.long),
	          title: info.city
	      });
	      marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
	      
	      google.maps.event.addListener(marker, 'click', function(){
	          infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
	          infoWindow.open($scope.map, marker);
	      });
	      
	      $scope.markers.push(marker);
	      
	  }  
	  
	  for (i = 0; i < cities.length; i++){
	      createMarker(cities[i]);
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
            infoWindow.setContent('Location found.');
            infoWindow.open($scope.map);
            $scope.map.setCenter(pos);
            $http({
			    url: "https://instagram.com/oauth/authorize/?client_id=addfff357dc945c2a37a680552df22c8&redirect_uri=http://http://localhost/app-skeleton&response_type=token", 
			    method: "GET",
			}).then(function(response) {
				console.log(response);
			});
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

  }
]);