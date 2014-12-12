'use strict';

var controllers = angular.module('controllers', ['services']);

function MenuController($scope, $route, $routeParams, $location) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
}

function TestReportController($scope, TestReport, Author, Camera) {
	
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
}

function AuthorController($scope, Author) {
	
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
}

function CameraController($scope, Camera) {
	
	$scope.currentCamera = new Camera();
    $scope.cameras = Camera.query();

    $scope.cancel = function () {
        $scope.currentCamera = new Camera();
    };

    $scope.save = function () {
    	if (!$scope.cameraForm.$invalid) {
	        var isNew = $scope.currentCamera.id == null;
	        if (isNew) {
	            $scope.currentCamera = Camera.save($scope.currentCamera);
	            $scope.cameras.push($scope.currentCamera);
	        } else {
	            $scope.currentCamera = Camera.update($scope.currentCamera);
	        }
	        $scope.cancel();
	        $scope.cameraForm.$setPristine();
    	}
    };

    $scope.edit = function (camera) {
        $scope.currentCamera = camera;
    };

    $scope.remove = function (index, id) {
		$scope.cameras.splice(index, 1);
		Camera.remove({'id':id});
    };
}

function CommentController($scope, Comment) {
	
	$scope.currentComment = new Comment();
    $scope.comments = Comment.query();
    
    $scope.cancel = function () {
        $scope.currentComment = new Comment();
    };

    $scope.save = function () {
    	if (!$scope.commentForm.$invalid) {
	        var isNew = $scope.currentComment.id == null;
	        if (isNew) {
	        	$scope.currentComment.testReport = $scope.testReport;
	            $scope.currentComment = Comment.save($scope.currentComment);
	            $scope.comments.push($scope.currentComment);
	            $scope.testReport.comments.push($scope.currentComment);
	        } else {
	            $scope.currentComment = Comment.update($scope.currentComment);
	        }
	        $scope.cancel();
	        $scope.commentForm.$setPristine();
    	}
    };

    $scope.remove = function (index, id) {
    	$scope.comments.splice(index, 1);
		$scope.testReport.comments.splice(index, 1);
		Comment.remove({'id':id});
    };
}