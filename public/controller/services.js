angular.module('Myapp.services', [])

.service('authentication',function($http, $window) {

    var saveToken = function (token) {
      console.log('Token Recieved : ', token);
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    signup=function(frm)
    {
      return $http.post('/signup',frm);
    }

     login=function(frm)
    {
      return $http.post('/login',frm);
    }

       return {
     
      saveToken : saveToken,
      getToken : getToken,
      login:login,
      signup:signup
     
    }
    
    })
