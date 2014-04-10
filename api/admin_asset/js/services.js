'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var AveneAdminServices = angular.module('AveneAdmin.services', [])
    .value('ROOT', '/avene_sun/api/index.php')
    .value('ROOT_FOLDER', '/avene_sun/api/');
