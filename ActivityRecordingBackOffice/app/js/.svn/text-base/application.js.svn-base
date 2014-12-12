'use strict';

var camerareviewapp = angular.module('camerareviewapp', ['controllers', 'services','directives'],

	function($routeProvider, $locationProvider) {
	
		$routeProvider.when('/view.testreports', {
			templateUrl : 'view.testreports.html',
			controller : TestReportController
		});
	
		$routeProvider.when('/admin.authors', {
			templateUrl : 'admin.authors.html',
			controller : AuthorController
		});
		
		$routeProvider.when('/admin.cameras', {
			templateUrl : 'admin.cameras.html',
			controller : CameraController
		});
		
		$routeProvider.when('/admin.testreports', {
			templateUrl : 'admin.testreports.html',
			controller : TestReportController
		});
		
		$routeProvider.when('/admin.comments', {
			templateUrl : 'admin.comments.html',
			controller : CommentController
		});
	}
);

