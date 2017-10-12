angular.module('app')
  .controller('RegisterController', function($scope, $state, UserService) {


    $scope.register = function() {
      var user = $scope.user;
      UserService.create(user).then(function() {
        // $state.go('user.users');
      });
    };
  });
