AveneAdminController

    .controller('PhotoCtrList', function($scope, $http, $modal, $log, $routeParams, PhotoService, ROOT) {
        params = {status:$routeParams.status, pagenum:20};
        PhotoService.list(params, function(data){
            var total = $scope.counts.all;
            switch($routeParams.status) {
                case '1':
                    total = $scope.counts.approved;
                    break;
                case '0':
                    total = $scope.counts.unapproved;
                    break;
            }
            $scope.photos = data.data;
            $scope.bigTotalItems = total;
            $scope.noOfPages = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.maxSize = 5;
            $scope.numPages = 20;
        });


        $scope.pageChanged = function (page) {
            params.page = page;
            if($scope.type == "search")
            {
                $scope.search(page);
            }
            else
            {
                PhotoService.list(params, function(data){
                    $scope.photos = data.data;
                });
            }
        };

        $scope.approve = function (photo) {
            if(photo.status == 0) {
                photo.status = 1;
            }
            else {
                photo.status = 0;
            }
            PhotoService.changeStatus({pid:photo.pid, status:photo.status});
        };

        $scope.search = function (page) {
            $scope.type = "search";
            var gender = $scope.gender;
            var username = $scope.username;
            var location = $scope.location;
            var params = {gender: gender, username: username, location: location, pagenum:20, page:page};
            PhotoService.search(params, function(data){
                $scope.photos = data.data;
                $scope.bigTotalItems = data.message;
            });
        };
    })



    .controller('ScarfCtrSearch', function($scope, $http, $modal, $log, $routeParams, PhotoService, ROOT) {
        params = {};
        PhotoService.search($routeParams.keyword, function(data){
            $scope.scarfs = data.data;
            $scope.bigTotalItems = data.total;
            $scope.noOfPages = 0;
            $scope.currentPage = 1;
            $scope.maxSize = 5;
        });
        $scope.pageChanged = function (page) {
            params.page = page;
            PhotoService.list(params, function(data){
                $scope.scarfs = data;
            });
        };
        $scope.approve = function (scarf) {
            scarf.status = 1;
            PhotoService.update(scarf, function(data){
                $scope.scarfs.splice($scope.scarfs.indexOf(scarf), 1);
            });
        };
        $scope.delete = function(scarf) {
            var modalInstance = $modal.open({
                templateUrl: ROOT+'admin_asset/tmp/dialog/delete.html',
                controller: ConfirmModalCtrl
            });
            modalInstance.result.then(function () {
                scarf.status = 4;
                PhotoService.update(scarf, function(data){
                    $scope.scarfs.splice($scope.scarfs.indexOf(scarf), 1);
                });
            }, function () {
            });
        }
        $scope.unapprove = function (scarf) {
            var modalInstance = $modal.open({
                templateUrl: ROOT+'admin_asset/tmp/dialog/delete.html',
                controller: ConfirmModalCtrl
            });
            modalInstance.result.then(function () {
                scarf.status = 0;
                PhotoService.update(scarf, function(data){
                    $scope.scarfs.splice($scope.scarfs.indexOf(scarf), 1);
                });
            }, function () {
            });
        };
    })



