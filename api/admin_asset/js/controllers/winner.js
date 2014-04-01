AveneAdminController

    .controller('WinnerPostCtrList', function($scope,$upload, $http, $modal,$location, $log, $routeParams, PhotoService, WinnerService, ROOT, ROOT_FOLDER) {
        $scope.winner = {};
        $scope.onFileSelect = function($files, type) {
            var file = $files[0];
            $scope.upload = $upload.upload({
                url: ROOT+'/winner/UploadImage',
                data: {type: type},
                file: file
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    $scope.winner[type+"_preview"] = ROOT_FOLDER + data.data;
                    $scope.winner[type] = data.data;
                });
        }

        $scope.submit = function() {
            var winner = {
                month : $scope.winner.month,
                name : $scope.winner.name,
                avatar : $scope.winner.avatar,
                url : $scope.winner.url,
                photo : $scope.winner.photo,
                prize : $scope.winner.prize,
                prize_img : $scope.winner.prize_img
            }
            WinnerService.post(winner, function(res){
                if(res == 1) {
                    $location.path( "/winner/list" );
                }
            });
        }


    })


    .controller('WinnerListCtrList', function($scope,$upload, $http, $modal, $log, $routeParams, PhotoService, WinnerService, ROOT_FOLDER) {
        WinnerService.list(function(res){
            $scope.winners = res.data;
        });

        $scope.delete = function(winner) {
            var modalInstance = $modal.open({
                templateUrl: ROOT_FOLDER+'admin_asset/tmp/dialog/delete.html',
                controller: ConfirmModalCtrl
            });
            modalInstance.result.then(function () {
                WinnerService.delete({wid:winner.wid}, function(res){
                    if(res == 1) {
                        $scope.winners.splice($scope.winners.indexOf(winner), 1);
                    }
                });
            }, function () {
            });
        }
    })

    .controller('WinnerEditCtrList', function($scope,$upload, $http,$location, $modal, $log, $routeParams, PhotoService, WinnerService, ROOT_FOLDER) {
        WinnerService.get($routeParams.wid,function(res){
            $scope.winner = res.data;
            $scope.winner.photo_preview = ROOT_FOLDER + $scope.winner.photo;
            $scope.winner.prize_img_preview = ROOT_FOLDER + $scope.winner.prize_img;
        });

        $scope.submit = function() {
            var winner = {
                wid : $scope.winner.wid,
                month : $scope.winner.month,
                name : $scope.winner.name,
                avatar : $scope.winner.avatar,
                url : $scope.winner.url,
                photo : $scope.winner.photo,
                prize : $scope.winner.prize,
                prize_img : $scope.winner.prize_img
            }
            WinnerService.put(winner, function(res){
                if(res == 1) {
                    $location.path( "/winner/list" );
                }
            });
        }
    })

