angular.module('Myapp.controller', [])

.controller('signupCtrl',function($scope,$rootScope,authentication,$location){
   $scope.save=function(frm){
    if (frm.$valid) {
        authentication.signup({   
            username:$scope.username,
            email:$scope.email,
            password:$scope.password 
           }).then(function(data) {
             $location.path('/'); 
             alert("Data added successfully");
              },
                function (data, status, headers, config) {
                alert('server error timeout');
      })
}
}
 
})
.controller('loginCtrl', function($location,$scope,$rootScope,authentication,$http,$window) {
 if (authentication.getToken()) {
    $http.get('/check_login',{headers: {Authorization: 'JWT'+' '+authentication.getToken()}}).then(function(response){
                  if (response.data===true) {
                    $location.path('/app/home');
                  }
                  else
                  {
                     $location.path('/');
                     $window.localStorage.removeItem('mean-token');
                  }
              })
      }
      else
      {
         $location.path('/');
         $window.localStorage.removeItem('mean-token');
      }
  $scope.loginform=function(frm){
    if (frm.$valid) {
    authentication.login({email:$scope.email,password:$scope.password}).then(function(data) {
      $location.path('/app/home');
      authentication.saveToken(data.data.token);
    }, function(err) {
       alert('error occured')
    })
    }
  };
})

.controller('homeCtrl', function($location,$scope,$http,$rootScope,authentication,$window) {
  $http.get('/getSignupData',{headers: {Authorization: 'JWT'+' '+authentication.getToken()}}).then(function(response){
    console.log(response);
  },function(errordata)
  {
    if(errordata.data==="Unauthorized")
    {
      $window.localStorage.removeItem('mean-token');
    $location.path('/'); 
    }
  })
  $scope.logout=function() {
    $window.localStorage.removeItem('mean-token');
    $location.path('/'); 
  };
})
