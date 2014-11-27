'use strict';

var ActivityRecordingBackOffice = angular.module('ActivityRecordingBackOffice', ['ngRoute','controllers', 'services', 'config']);

ActivityRecordingBackOffice.config(function($routeProvider) {
		
		$routeProvider.when('/view.activities', {
			templateUrl : 'view.activites.html',
			controller : ActivitiesCtrl  
		});
                
		$routeProvider.when('/view.approval', {
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

