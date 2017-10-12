angular.module('app')
  .controller('NewsController', function($scope, CurrentUser, UserService, $state) {
    $scope.user = CurrentUser.user();

    function loadAllUsers() {
      UserService.getAll().then(function(res) {
        $scope.listUsers = res.data;
      });
    }
    loadAllUsers();

    $scope.showConfirm = function(ev, id) {
      swal({
        text: "Voulez-vous supprimer cet utilisateur ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
      }).then(function() {
        UserService.delete(id).then(function(res) {
            swal({
              type: 'success',
              showConfirmButton: false,
              text: 'Element supprimé',
              timer: 2000
            });
            loadAllUsers();
          },
          function(err) {
            swal({
              type: 'error',
              title: 'Une erreur s\'est produite',
              text: 'Vous pouvez réessayer',
              timer: 2000
            });
          });
      });
    };
  });
