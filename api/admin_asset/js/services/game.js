AveneAdminServices.factory( 'GameService', function($http, ROOT) {
    return {


        list: function( param , success) {

            $http.get(ROOT+'/game/list?'+new Date().getTime(), {
                params: param,
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
