angular.module('Myapp', ['ngMaterial','ngRoute','ngStorage','ngMessages','ngAnimate','Myapp.services','Myapp.controller'])

  .config (function($routeProvider, $locationProvider) {
    $routeProvider
     .when('/', {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
      })
      .when('/app/signup', {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl',
      })
      .when('/app/home', {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',
      })

      .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  })

/*.run(function($rootScope, $location,$window,authentication,$http) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    });
  })
*/