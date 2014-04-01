AveneAdminServices.factory( 'WinnerService', function($http, ROOT) {
    return {
        post: function(param, success) {

            $http.post(ROOT+'/winner/post', param, {
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        },
        put: function(param, success) {

            $http.post(ROOT+'/winner/put', param, {
                cache: false
            })
                .success(function(data) {
                    success(data);
                })
                .error(function() {
                });
        },

        delete: function(param, success) {

            $http.post(ROOT+'/winner/delete', param, {
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        },

        list: function( success) {

            $http.get(ROOT+'/winner/list?'+new Date().getTime(), {
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        },

        get: function(wid, success) {

            $http.get(ROOT+'/winner/getById?'+new Date().getTime(), {
                params: {wid:wid},
                cache: false
            })
            .success(function(data) {
                success(data);
            })
            .error(function() {
            });
        }




    };
});
