
var idb = require('idb');

const dbPromise = idb.open('transApp', 1, upgradeDB => {
  upgradeDB.createObjectStore('stations', {
      keyPath: 'id'
  });
  upgradeDB.createObjectStore('stops', {
      keyPath: 'id'
  });
});


TransApp.factory('Stations', function($resource){
	return new Promise(function(resolve, reject) {

		dbPromise.then(function(db) {
		  	var tx = db.transaction('stations', 'readwrite');
			var table = tx.objectStore('stations');

		    return table.getAll();
		}).then(function(fromIndxDB){
			if(fromIndxDB.length > 0){
				resolve(fromIndxDB);
			} else {
				var Stations = $resource('http://api.511.org/transit/stops?api_key=05656916-e400-4b2b-92f3-38692ed2f250&format=Json&operator_id=Capitol Corridor');

				Stations.get(function(stations){
					var S = stations.Contents.dataObjects.ScheduledStopPoint;
					console.log("Stations:");
					console.log(S);

					dbPromise.then(function(db) {
						var tx = db.transaction('stations', 'readwrite');
					    var table = tx.objectStore('stations');

					    S.forEach(function(s) {
					      table.put(s);
					    });
					    resolve(S);
					});
				});
			}

		});		
	});
	
});


TransApp.factory('TimeTable', function($resource){

	var service = {};
	service.getTimes = function(stationID){
		var storeID;
		return new Promise(function(resolve, reject) {

			dbPromise.then(function(db) {
			  	var tx = db.transaction('stops', 'readwrite');
				var table = tx.objectStore('stops');

				var d = new Date();
				storeID = stationID + "-" + d.getMonth() + d.getDate() + d.getFullYear();
			    return table.get(storeID);
			}).then(function(fromIndxDB){
				if(fromIndxDB){
					resolve(fromIndxDB);
				} else {
					var TimeTable = $resource('http://api.511.org/transit/stoptimetable?api_key=05656916-e400-4b2b-92f3-38692ed2f250&OperatorRef=Capitol%20Corridor&format=json&MonitoringRef=:id', {id: "@id"});

					TimeTable.get({id : stationID}, function(times){
						var T = times.Siri.ServiceDelivery.StopTimetableDelivery.TimetabledStopVisit;

						dbPromise.then(function(db) {
							var tx = db.transaction('stops', 'readwrite');
						    var table = tx.objectStore('stops');
					    
						    table.put({id: storeID, T});
						    
						    resolve({T});
						});
					});
				}

			});		
		});
	}
	return service;
	
});



