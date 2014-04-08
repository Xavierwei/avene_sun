AveneAdminServices.factory( 'TrialService', function($http, ROOT) {
    return {


        list: function( success) {
            $http.get(ROOT+'/trial/list?'+new Date().getTime(), {
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
