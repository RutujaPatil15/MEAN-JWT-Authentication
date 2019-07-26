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

.run(function($rootScope, $location,$window,authentication,$http) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if($location.url()=="/app/signup")
      {
         console.log($location.url());
         $location.url('/app/signup');
         authentication.removeToken();
      }
    else if(authentication.getToken()) {
    $http.get('/check_login',{headers: {Authorization: 'JWT'+' '+authentication.getToken()}}).then(function(response){
                  if (response.data===true) {
                    $location.path('/app/home');
                  }
                  else
                  {
                     $location.path('/');
                     authentication.removeToken();
                  }
              })
      }
      else
      {
         $location.path('/');
         authentication.removeToken();
      }
    });
  })