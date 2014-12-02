'use strict';

var controllers = angular.module('controllers', ['services']);

function MenuCtrl($scope, $route, $routeParams, $location) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
};

function TestReportCtrl($scope, $location, TestReport, Author, Camera) {
	
    $scope.currentTestReport = new TestReport();
    $scope.testReports = TestReport.query();
    
    $scope.authors = Author.query(); // TODO overhead?
	$scope.cameras = Camera.query();
	
    $scope.cancel = function () {
        $scope.currentTestReport = new TestReport();
    };

    $scope.save = function () {
    	if (!$scope.testReportForm.$invalid) {
	        var isNew = $scope.currentTestReport.id == null;
	        if (isNew) {
	            $scope.currentTestReport = TestReport.save($scope.currentTestReport);
	            $scope.testReports.push($scope.currentTestReport);
	        } else {
	            $scope.currentTestReport = TestReport.update($scope.currentTestReport);
	        }
	        $scope.cancel();
	        $scope.testReportForm.$setPristine();
    	}
    };

    $scope.edit = function (testReport) {
        $scope.currentTestReport = testReport;
    };

    $scope.remove = function (index, id) {
		$scope.testReports.splice(index, 1);
		TestReport.remove({'id':id});
    };
    
    $scope.goTo = function(){
      $location.path( '/view.approval' );  
    };
    
};

function CasesCtrl($scope, $location, TreatmentCase) {
	
    $scope.currentCase = new TreatmentCase();
    $scope.cases = TreatmentCase.query();

    $scope.cancel = function () {
        $scope.currenttCase = new TreatmentCase();
    };

    $scope.save = function () {
    	if (!$scope.caseForm.$invalid) {
	        var isNew = $scope.currentCase.id == null;
	        if (isNew) {
	            $scope.currentCase = TreatmentCase.save($scope.currentCase);
	            $scope.cases.push($scope.currentCase);
	        } else {
	            $scope.currentCase = TreatmentCase.update($scope.currentCase);
	        }
	        $scope.cancel();
	        $scope.caseForm.$setPristine();
    	}
    };

    $scope.edit = function (treatmentCase) {
        $scope.currentTreatmentCase = treatmentCase;
    };

    $scope.remove = function (index, id) {
		$scope.cases.splice(index, 1);
		TreatmentCase.remove({'id':id});
    };
    
    $scope.goTo = function(fid){
      $location.path('/view.activities/'+fid);  
    };
    
};

function ApprovalCtrl($scope, $routeParams, $location, TreatmentCase) {

    $scope.fid = $routeParams.fid;
    $scope.currentCase = new TreatmentCase();
    $scope.cases = TreatmentCase.query();

    
    $scope.cancel = function () {
        $scope.currentCase = new TreatmentCase();
    };

    $scope.save = function () {
    	if (!$scope.commentForm.$invalid) {
	        var isNew = $scope.currentCase.id == null;
	        if (isNew) {
	        	$scope.currentCase.testReport = $scope.testReport;
	            $scope.currentCase = TreatmentCase.save($scope.currentCase);
	            $scope.comments.push($scope.currentCase);
	            $scope.testReport.comments.push($scope.currentCase);
	        } else {
	            $scope.currentCase = TreatmentCase.update($scope.currentCase);
	        }
	        $scope.cancel();
	        $scope.commentForm.$setPristine();
    	}
    };

    $scope.remove = function (index, id) {
    	$scope.cases.splice(index, 1);
		$scope.cases.splice(index, 1);
		TreatmentCase.remove({'id':id});
    };
    
    $scope.back = function(){
      $location.path( '/view.activities/'+$scope.fid);  
    };
    
    $scope.approve = function(){
      $location.path( '/view.cases' );  
    };

    
};

function ActivitiesCtrl($scope, $routeParams, $location, Activity, TimePeriod) {

    $scope.fid = $routeParams.fid;
    $scope.currentActivity = new Activity();
    $scope.activities = Activity.query({fid: $scope.fid});
    
    $scope.currentTimePeriode = new TimePeriod();
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    
    $scope.cancel = function () {
        $scope.currentActivity = new Activity();
    };

    $scope.save = function () {
    	if (!$scope.commentForm.$invalid) {
	        var isNew = $scope.currentActivity.id == null;
	        if (isNew) {
	        	$scope.currentActivity.testReport = $scope.testReport;
	            $scope.currentActivity = Activity.save($scope.currentActivity);
	            $scope.activities.push($scope.currentActivity);
	            $scope.testReport.comments.push($scope.currentActivity);
	        } else {
	            $scope.currentActivity = Activity.update($scope.currentActivity);
	        }
	        $scope.cancel();
	        $scope.commentForm.$setPristine();
    	}
    };

    $scope.remove = function (index, id) {
    	$scope.comments.splice(index, 1);
		$scope.activities.splice(index, 1);
		Activity.remove({'id':id});
    };   
    
    $scope.back = function(){
      $location.path( '/view.cases/');  
    };
    $scope.next = function(){
      $location.path( '/view.approval/'+$scope.fid );  
    };
};

function SuppliersCtrl($scope, Author) {
	
	$scope.currentAuthor = new Author();
    $scope.authors = Author.query();

    $scope.cancel = function () {
        $scope.currentAuthor = new Author();
    };

    $scope.save = function () {
    	if (!$scope.authorForm.$invalid) {
	        var isNew = $scope.currentAuthor.id == null;
	        if (isNew) {
	            $scope.currentAuthor = Author.save($scope.currentAuthor);
	            $scope.authors.push($scope.currentAuthor);
	            
	        } else {
	            $scope.currentAuthor = Author.update($scope.currentAuthor);
	        }
	        $scope.cancel();
	        $scope.authorForm.$setPristine();
    	}
    };

    $scope.edit = function (author) {
        $scope.currentAuthor = author;
    };

    $scope.remove = function (index, id) {
		$scope.authors.splice(index, 1);
		Author.remove({'id':id});
    };
};