AveneAdminController
    .controller('TrialListCtrList', function($scope,$upload, $http, $modal, $log, $routeParams, TrialService, ROOT_FOLDER) {
		TrialService.list(function(res){
            $scope.trials = res.data;
        });

//        $scope.delete = function(winner) {
//            var modalInstance = $modal.open({
//                templateUrl: ROOT_FOLDER+'admin_asset/tmp/dialog/delete.html',
//                controller: ConfirmModalCtrl
//            });
//            modalInstance.result.then(function () {
//                WinnerService.delete({wid:winner.wid}, function(res){
//                    if(res == 1) {
//                        $scope.winners.splice($scope.winners.indexOf(winner), 1);
//                    }
//                });
//            }, function () {
//            });
//        }
    })


