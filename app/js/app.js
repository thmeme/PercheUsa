angular.module('app', ['ui.router', 'ui.bootstrap', 'ngIntlTelInput'])
.config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({initialCountry: 'fr'});
  });
