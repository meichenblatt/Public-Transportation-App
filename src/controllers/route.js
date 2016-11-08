TransApp.controller('routeController', function($scope, $rootScope, $location, TimeTable) {

	var trips = [];
	$scope.message = false;
	var departTimes;
	var arriveTimes;

	TimeTable.getTimes($rootScope.depart).then(function(times){
		departTimes = times.T;
		console.log(departTimes);
		console.log(times);

		return TimeTable.getTimes($rootScope.arrive);
	}).then(function(times){
		arriveTimes = times.T;
		console.log(arriveTimes);

		departTimes.forEach(function(dt){

			arriveTimes.forEach(function(at){

				if(dt.TargetedVehicleJourney.DatedVehicleJourneyRef === at.TargetedVehicleJourney.DatedVehicleJourneyRef &&
					dt.TargetedVehicleJourney.TargetedCall.AimedDepartureTime < at.TargetedVehicleJourney.TargetedCall.AimedArrivalTime){
					var obj = {};
					var depart = new Date(dt.TargetedVehicleJourney.TargetedCall.AimedDepartureTime);
					obj.depart = depart.toTimeString();
					var arrive = new Date(at.TargetedVehicleJourney.TargetedCall.AimedArrivalTime);
					obj.arrive = arrive.toTimeString();
					trips.push(obj); 
					console.log(obj);
				}
			})			
		})
		if(trips.length == 0){
			$scope.message = true;
		}

		$scope.$apply(function () {
			$scope.trips = trips;
		});	

		
	});

});
