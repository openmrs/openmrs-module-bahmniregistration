'use strict';

angular.module('registration.patient.services')
    .factory('encounterService', ['$http', '$rootScope', function ($http, $rootScope) {
    
    var create = function (encounter) {

        encounter.providers = encounter.providers || [];
        if ($rootScope.currentProvider && $rootScope.currentProvider.uuid) {
            encounter.providers.push( { "uuid" : $rootScope.currentProvider.uuid } );
        }

        return $http.post(constants.emrApiRESTBaseURL + '/encounter', encounter, {
            withCredentials: true
        });
    };

    var getActiveEncounter =  function (patientUuid, visitTypeUuid, encounterTypeUuid) {
        var url = constants.emrApiRESTBaseURL + "/encounter/active";
        return $http.get(url, {
            params: {"patientUuid": patientUuid, "visitTypeUuid" : visitTypeUuid, "encounterTypeUuid" : encounterTypeUuid, "includeAll" : false},
            withCredentials: true
        });
    }

    var getDigitized = function(patientUuid, encounterTypeUuid) {
        return $http.get(constants.baseOpenMRSRESTURL + "/encounter", {
            params:{
                patient: patientUuid,
                encounterType: encounterTypeUuid,
                v: "custom:(uuid)"
            },
            withCredentials : true
        });
    }

    return {
        create: create,
        getActiveEncounter : getActiveEncounter,
        getDigitized: getDigitized
    };
}]);