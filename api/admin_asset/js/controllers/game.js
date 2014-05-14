AveneAdminController
    .controller('GameListCtrList', function($scope,$upload, $http, $modal, $log, $routeParams, GameService, ROOT_FOLDER) {

    	$scope.filterPage = function(){
            $scope.start_date = document.querySelector('input[name="start_date"]').value;
            $scope.end_date = document.querySelector('input[name="end_date"]').value;
            param = {start_date: $scope.start_date , end_date: $scope.end_date};
            GameService.list( param ,  function(res){
	            $scope.games = res.data;
                $scope.bigTotalItems = res.message;
	        });
        }

    	var param = {start_date: $scope.start_date , end_date: $scope.end_date};
        GameService.list( param ,  function(res){
            $scope.games = res.data;
            $scope.bigTotalItems = res.message;
            $scope.noOfPages = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;
            $scope.maxSize = 5;
            $scope.numPages = 10;
        });

        $scope.pageChanged = function (page) {
            param.page = page;
            GameService.list(param, function(data){
                $scope.games = data.data;
            });
        };

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


