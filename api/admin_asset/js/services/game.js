AveneAdminServices.factory( 'GameService', function($http, ROOT) {
    return {


        list: function( success) {

            $http.get(ROOT+'/game/list?'+new Date().getTime(), {
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
