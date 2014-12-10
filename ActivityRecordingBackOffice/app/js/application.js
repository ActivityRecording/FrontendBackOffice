'use strict';

var ActivityRecordingBackOffice = angular.module('ActivityRecordingBackOffice', ['ngRoute','controllers', 'services', 'config', 'ui.bootstrap.datetimepicker']);

ActivityRecordingBackOffice.config(function($routeProvider) {
		
		$routeProvider.when('/view.activities/:fid', {
			templateUrl : 'view.activities.html',
			controller : ActivitiesCtrl  
		});
                
		$routeProvider.when('/view.approval/:fid', {
			templateUrl : 'view.approval.html',
			controller : ApprovalCtrl
		});
                
		$routeProvider.when('/view.cases', {
			templateUrl : 'view.cases.html',
			controller : CasesCtrl
		});
                
                $routeProvider.when('/view.suppliers', {
			templateUrl : 'view.suppliers.html',
			controller : SuppliersCtrl
		});

});

