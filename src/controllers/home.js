TransApp.controller('homeController', function($scope, $rootScope, $location, Stations) {
	$scope.errorMessage = false;

	Stations.then(function(stations){
		$scope.$apply(function () {
            $scope.stations = stations;
        });		
	});
	
	$scope.validate = function(){

		if($scope.depart == undefined){
			document.getElementById("depart").style.borderColor = "red";
		} else{
			document.getElementById("depart").style.borderColor = "#32CD32";
		}			

		if($scope.arrive == undefined){
			document.getElementById("arrive").style.borderColor = "red";
		} else{
			document.getElementById("arrive").style.borderColor = "#32CD32";
		}	

		if($scope.depart != undefined){
			if($scope.depart == $scope.arrive){
				$scope.errorMessage = true;
			} else {
				$scope.errorMessage = false;
			}
		}
			
	}

	$scope.getSchedule = function(){
		console.log($scope.depart);
		console.log($scope.arrive);

		$scope.validate();

		if($scope.depart !== undefined && $scope.arrive !== undefined && $scope.depart !== $scope.arrive){
			$rootScope.depart = $scope.depart;
			$rootScope.arrive = $scope.arrive;
			$location.path("/route");
		}
	}
});

