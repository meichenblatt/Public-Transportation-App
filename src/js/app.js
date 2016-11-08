if ('serviceWorker' in navigator) {
  
  navigator.serviceWorker.register('/sw.js', { scope: './'}).then(function(reg) {
      console.log("service worker working");  
  });

} else {
  console.log("this browser does NOT support service worker");
}


var TransApp = angular.module('TransApp', ['ngRoute', 'ngResource']);

TransApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        controller:  'homeController',
        templateUrl: 'tmpl/home.html'
    })
    .when('/route', {
        controller:  'routeController',
        templateUrl: 'tmpl/route.html'
    })
    .otherwise({
        redirect: '/'
    });
    $locationProvider.html5Mode(true);
});
