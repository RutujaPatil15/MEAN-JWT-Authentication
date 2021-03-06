angular.module('Myapp.controller', [])

.controller('signupCtrl',function($scope,$rootScope,authentication,$location){
   $scope.save=function(frm){
    if (frm.$valid) {
    authentication.signup({username:$scope.username,email:$scope.email,password:$scope.password }).then(function(data) {
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
  $scope.loginform=function(frm){
    if (frm.$valid) {
    authentication.login({email:$scope.email,password:$scope.password}).then(function(data) {
      $location.path('/app/home');
      authentication.saveToken(data.data.token);
    }, function(err) {
       alert('Enter correct email or password');
    })
    }
  };
})

.controller('homeCtrl', function($location,$scope,$http,$rootScope,authentication,$window) {
  $http.get('/getData',{headers: {Authorization: 'JWT'+' '+authentication.getToken()}}).then(function(response){
   console.log(response.data);
  },function(error)
  {
    authentication.removeToken();
    $location.path('/'); 
  })
  $scope.logout=function() {
    authentication.removeToken();
    $location.path('/'); 
  };
})

