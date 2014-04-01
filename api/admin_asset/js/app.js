'use strict';


// Declare app level module which depends on filters, and services
var SGWallAdmin = angular.module('AveneAdmin', [
  'ui.bootstrap',
  'angularFileUpload',
  'ngRoute',
  'AveneAdmin.filters',
  'AveneAdmin.services',
  'AveneAdmin.directives',
  'AveneAdmin.controllers'
]).
config(function($routeProvider,$httpProvider) {
    var ROOT = '/avene_photowall/api/';
    $routeProvider.when('/photo/list/:status', {templateUrl: ROOT+'/admin_asset/tmp/photo/list.html?2', controller: 'PhotoCtrList'});
    $routeProvider.when('/winner/post', {templateUrl: ROOT+'/admin_asset/tmp/winner/post.html', controller: 'WinnerPostCtrList'});
    $routeProvider.when('/winner/edit/:wid', {templateUrl: ROOT+'/admin_asset/tmp/winner/post.html', controller: 'WinnerEditCtrList'});
    $routeProvider.when('/winner/list', {templateUrl: ROOT+'/admin_asset/tmp/winner/list.html', controller: 'WinnerListCtrList'});
//    $routeProvider.when('/scarf/unapproved', {templateUrl: ROOT+'/admin_asset/tmp/scarf/list.html', controller: 'ScarfCtrListUnapproved'});
//    $routeProvider.when('/scarf/produced', {templateUrl: ROOT+'/admin_asset/tmp/scarf/list-produced.html', controller: 'ScarfCtrListProduced'});
//    $routeProvider.when('/scarf/all', {templateUrl: ROOT+'/admin_asset/tmp/scarf/list-all.html', controller: 'ScarfCtrListAll'});
//    $routeProvider.when('/production/producing', {templateUrl: ROOT+'/admin_asset/tmp/scarf/list-producing.html', controller: 'ScarfCtrListProducing'});
//    $routeProvider.when('/scarf/search/:keyword', {templateUrl: ROOT+'/admin_asset/tmp/scarf/list-all.html', controller: 'ScarfCtrSearch'});

    $routeProvider.otherwise({redirectTo: '/photo/list/0'});


    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest = [function(data)
    {
        var param = function(obj)
        {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj)
            {
                value = obj[name];

                if(value instanceof Array)
                {
                    for(i=0; i<value.length; ++i)
                    {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object)
                {
                    for(subName in value)
                    {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

