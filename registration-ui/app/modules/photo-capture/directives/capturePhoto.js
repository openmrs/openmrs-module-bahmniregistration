'use strict';

angular.module('registration.photoCapture', [])
    .directive('capturePhoto', ['$parse', '$window', '$rootScope',function factory($parse, $window, $rootScope) {
        var directiveDefinitionObject = {
            templateUrl: 'modules/photo-capture/views/photo.html',
            restrict: 'A',
            scope: true,
            compile: function compile() {
                return {
                    post: function postLink(scope, iElement, iAttrs) {
                        var activeStream,
                            dialogElement = iElement.find(".photoCaptureDialog"),
                            video = dialogElement.find("video")[0],
                            canvas = dialogElement.find("canvas")[0],
                            confirmImageButton = dialogElement.find(".confirmImage"),
                            streaming = false,
                            dialogOpen = false;
                         var context = canvas.getContext("2d");
                         var pixelRatio = window.devicePixelRatio;
                         context.scale(pixelRatio, pixelRatio);

                        scope.launchPhotoCapturePopup = function () {
                            if(dialogOpen) {
                                alert("Please allow access to web camera and wait for photo capture dialog to be launched");
                                return;
                            }
                             var videoConstraints = {
        "mandatory": {
            "maxWidth": 1920,
                "maxHeight": 1080
        },
        "optional": [
            {"minWidth": 1920},
            {"minHeight": 1080}
        ]
    };
                            dialogOpen = true;
                            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                            if (navigator.getUserMedia) {
                                navigator.getUserMedia(
                                    {video: videoConstraints, audio: false},
                                    function (localMediaStream) {
                                        video.src = $window.URL.createObjectURL(localMediaStream);
                                        activeStream = localMediaStream;
                                        dialogElement.dialog('open');
                                    },
                                    function () {
                                        alert("Could not get access to web camera. Please allow access to web camera");
                                    }
                                );
                            } else {
                                alert('Photo capture is not supported in your browser. Please use chrome');
                            }
                        };

                        var closeDialog = function(){
                            dialogElement.dialog('close');
                        }

                        var onConfirmationSuccess = function(image){
                            var ngModel = $parse(iAttrs.ngModel);
                            ngModel.assign(scope, image);
                            closeDialog();
                        }    

                        scope.confirmImage = function () {
                            var dataURL = canvas.toDataURL("image/jpeg");
                            var image = dataURL;
                            if(iAttrs.capturePhoto) {
                                var onConfirmationPromise = scope[iAttrs.capturePhoto](image);
                                onConfirmationPromise.then(function(){
                                    onConfirmationSuccess(image);
                                }, function(response){
                                    $rootScope.server_error = null;
                                    alert("Failed to save image. Plaese try again later");
                                });
                            } else {
                                onConfirmationSuccess(image);
                            }

                        };

                        scope.clickImage = function () {
                            var sourceX = 0;
                            var sourceY = 0;
                            var destX = 0;
                            var destY = 0;

                            if (canvas.width > canvas.height) {
                                var stretchRatio = ( video.videoWidth / canvas.width );
                                var sourceWidth = video.videoWidth;
                                var sourceHeight = Math.floor(canvas.height * stretchRatio);
                                sourceY = Math.floor((video.videoHeight - sourceHeight)/2);
                            } else {
                                var stretchRatio = ( video.videoHeight / canvas.height );
                                var sourceWidth = Math.floor(canvas.width * stretchRatio);
                                var sourceHeight = video.videoHeight;
                                sourceX = Math.floor((video.videoWidth - sourceWidth)/2);
                            }
                            var destWidth = Math.floor(canvas.width / pixelRatio);
                            var destHeight = Math.floor(canvas.height / pixelRatio);
                            context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                            confirmImageButton.prop('disabled', false);
                            confirmImageButton.focus();
                        };

                        dialogElement.dialog({autoOpen: false, height: 1200, width: 1200, modal: true,
                            close: function(){
                                dialogOpen = false;
                                if (activeStream) {
                                    activeStream.stop();
                                }
                            }
                        });

                        iElement.bind("$destroy", function() {
                            dialogElement.dialog("destroy");
                        });
                    }
                }
            }
        };
        return directiveDefinitionObject;
    }]);
