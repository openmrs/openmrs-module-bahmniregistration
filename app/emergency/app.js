'use strict';


angular
    .module('emergency', ['infrastructure.httpErrorInterceptor','registration.patient.models', 'registration.emergency', 'registration.initialization', 'registration.loginController', 'registration.navigation'])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/create', {templateUrl: 'views/create.html', controller: 'CreateEmergencyPatientController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/summary', {templateUrl: 'views/summary.html', controller: 'EmergencyRegistrationSummaryController'});
        $routeProvider.when('/login', {templateUrl: '../modules/auth/views/login.html', controller: 'LoginController'});
        $routeProvider.otherwise({redirectTo: '/create'});
    }]).run(function ($rootScope, $templateCache) {
        //Disable caching view template partials
        $rootScope.$on('$viewContentLoaded', function () {
                $templateCache.removeAll();
            }
        )
    });