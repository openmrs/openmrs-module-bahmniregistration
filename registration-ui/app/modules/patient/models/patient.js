'use strict';

angular.module('registration.patient.models')
    .factory('patient', ['age', function (age) {
        var create = function () {
            var calculateAge = function () {
                if (this.birthdate) {
                    var birthDate = new Date(this.birthdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    this.age = age.fromBirthDate(birthDate);
                }
                else {
                    this.age = { years: null };
                }
            };

            var generateIdentifier = function () {
                if (this.registrationNumber && this.registrationNumber.length > 0) {
                    this.identifier = this.centerID.name + this.registrationNumber;
                }
                return this.identifier
            };

            var clearRegistrationNumber = function () {
                this.registrationNumber = null;
                this.identifier = null;
            };

            var fullNameLocal = function () {
                var givenNameLocal = this.givenNameLocal || "";
                var familyNameLocal = this.familyNameLocal || "";
                return (givenNameLocal.trim() + " " + familyNameLocal.trim()).trim();
            };

            var getImageData = function () {
                return this.image && this.image.indexOf('data') === 0 ? this.image.replace("data:image/jpeg;base64,", "") : null;
            };

            return {
                address: {},
                age: age.create(),
                calculateAge: calculateAge,
                generateIdentifier: generateIdentifier,
                clearRegistrationNumber: clearRegistrationNumber,
                image: 'images/blank-user.gif',
                fullNameLocal: fullNameLocal,
                getImageData: getImageData
            };
        };

        return {
            create: create
        }
    }]);
