AveneAdminServices.factory( 'PhotoService', function($http, ROOT) {
    return {
        list: function(param, success) {

            $http.get(ROOT+'/photo/list?'+new Date().getTime(), {
                params: param,
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        },

        search: function(params, success) {
            $http.get(ROOT+'/photo/search?'+new Date().getTime(), {
                params: params,
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        },

        changeStatus: function(data, success) {
            $http.post(ROOT+'/photo/changeStatus',data);
        },

        getStatistics: function(success) {
            $http.post(ROOT+'/photo/getStatistics')
                .success(function(data) {
                    success(data.data);
                })
                .error(function() {

                });
        },

        adminStatus: function(success) {
            $http.post(ROOT+'/admin/AdminStatus')
                .success(function(res) {
                    success(res);
                })
                .error(function() {

                });
        },

        logout: function(success) {
            $http.post(ROOT+'/admin/logout')
                .success(function() {
                    success();
                })
                .error(function() {

                });
        }
    };
});
