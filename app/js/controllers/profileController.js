angular.module('app')
  .controller('ProfileController', function($scope, $state, $timeout, $stateParams, CurrentUser, UserService) {
    $scope.user = CurrentUser.user();
    $scope.newUser = CurrentUser.user();
    console.log($scope.newUser);
    console.log('id', $scope.user._id);



    function editProfile() {
      UserService.getOne($scope.user._id).then(function(res) {
        console.log('res getOne', res);
        $scope.newUser = res.data;
        $scope.newUser.birthday = new Date (res.data.birthday);
        console.log(res.data.birthday);


      });
    }
    editProfile();

    $scope.updateProfile = function() {
      UserService.update($scope.newUser._id, $scope.newUser).then(function(res) {
        console.log('update', res);
      });
      $state.reload();
    };
  });
