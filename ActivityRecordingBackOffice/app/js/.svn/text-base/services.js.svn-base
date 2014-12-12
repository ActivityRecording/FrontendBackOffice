'use strict';

var services = angular.module('services', ['ngResource']);

services.factory('TestReport', function ($resource) {
    return $resource('rest/testreports/:id', {}, {
        'update': {method: 'PUT'}
    });
});

services.factory('Author', function ($resource) {
    return $resource('rest/authors/:id', {}, {
        'update': {method: 'PUT'},
       
    });
});

services.factory('Camera', function ($resource) {
    return $resource('rest/cameras/:id', {}, {
        'update': {method: 'PUT'}
    });
});

services.factory('Comment', function ($resource) {
    return $resource('rest/comments/:id', {}, {
        'update': {method: 'PUT'}
    });
});
