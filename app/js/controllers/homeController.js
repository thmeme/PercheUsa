angular.module('app')
  .controller('HomeController', function($scope, $state, Auth) {
    $scope.errors = [];

    $scope.login = function() {
      if ($scope.loginForm.$valid) {
        $scope.errors = [];
        Auth.login($scope.user).then(function(result) {
          $state.go('user.profile');
        }).catch(function(err) {
          $scope.errors.push(err);
        });
      }
    };
  });
