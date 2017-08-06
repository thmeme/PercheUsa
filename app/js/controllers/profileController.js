angular.module('app')
  .controller('ProfileController', function($scope, CurrentUser, UserService) {
    $scope.user = CurrentUser.user();
    $scope.newuser = CurrentUser.user();
    console.log($scope.newuser);
    console.log('id', $scope.user._id);

    function editProfile() {
      UserService.getOne($scope.user._id).then(function(res) {
        console.log('res getOne', res);
        $scope.newuser = res.data;
      });
    }
    editProfile();

    $scope.updateProfile = function() {
      UserService.update($scope.newuser._id, $scope.newuser).then(function(res) {
        console.log('update', res);
      });
    };
  });
