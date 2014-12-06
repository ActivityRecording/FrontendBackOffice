'use strict';
var controllers = angular.module('controllers', ['services']);
function MenuCtrl($scope, $route, $routeParams, $location) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
}
;
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
        TestReport.remove({'id': id});
    };
    $scope.goTo = function () {
        $location.path('/view.approval');
    };
}
;
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
                $scope.currentCase = Patient.save($scope.currentCase);
                $scope.cases.push($scope.currentCase);
            } else {
                $scope.currentCase = Patient.update($scope.currentCase);
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
        TreatmentCase.remove({'id': id});
    };
    $scope.goTo = function (fid) {
        $location.path('/view.activities/' + fid);
    };
}
;
function ActivitiesCtrl($scope, $routeParams, $location, Approval, Activity, TimePeriod, Supplier) {

    $scope.fid = $routeParams.fid;
    $scope.currentActivity = new Activity();
    $scope.activities = Approval.query({fid: $scope.fid});
//    $scope.currentTimePeriod = new TimePeriod();
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    $scope.currentSupplier = new Supplier();
    $scope.suppliers = Supplier.query();
    $scope.cancel = function () {
        $scope.currentActivity = new Activity();
    };
    $scope.save = function (type) {
        //Activity
        if (type === 0) {
            if (!$scope.activitiesForm.$invalid) {
                var isNew = $scope.currentActivity.activityId == null;
                if (isNew) {
                    var container = new Activity();
                    container.employeeId = $scope.currentActivity.supplier.employeeID;
                    container.treatmentNumber = $scope.fid;
                    container.tarmedActivityId = $scope.currentActivity.tarmedActivityId;
                    container.number = $scope.currentActivity.number;
                    container.$save().then(function () {
                        $scope.activities = Approval.query({fid: $scope.fid}).then(function (){
                            $scope.periods = TimePeriod.query({fid: $scope.fid});
                        });
                    });
                } else {
                    $scope.currentActivity = Activity.update($scope.currentActivity);
                }

                $scope.cancel();
                $scope.activitiesForm.$setPristine();
            }
        }
        //TimePeriod
        if (type === 1) {
            if (!$scope.timePeriodForm.$invalid) {
                var isNew = $scope.currentTimePeriod.timePeriodId == null;
                if (isNew) {

                    var newPeriode = new TimePeriod({'timePeriodId': null, 'type': 'TREATMENT'});
                    newPeriode.employeeId = $scope.currentTimePeriod.supplier.employeeID;
                    newPeriode.treatmentNumber = $scope.fid;
                    newPeriode.startTime = $scope.currentTimePeriod.startTime;
                    newPeriode.endTime = $scope.currentTimePeriod.endTime;
                    newPeriode.$save().then(function () {
                        $scope.activities = Approval.query({fid: $scope.fid});
                    });


                    $scope.periods.push($scope.currentTimePeriod);
                } else {
                    $scope.currentTimePeriod = TimePeriod.update($scope.currentTimePeriod);
                }
                $scope.cancel();
                $scope.timePeriodForm.$setPristine();
            }
        }
    };
    $scope.editPeriod = function (period) {
        $scope.currentTimePeriod = period;
    };
    $scope.removePeriod = function (index, id) {
        $scope.periods.splice(index, 1);
        $scope.activities.splice(index, 1);
        TimePeriod.$remove({'fid': id});
    };
    $scope.editActivity = function (activity) {
        $scope.currentActivity = activity;
    };
    $scope.removeActivit = function (index, id) {
        $scope.activities.splice(index, 1);
        Activity.$remove({'fid': id});
    };
    $scope.removePeriod = function (index, id) {
        $scope.comments.splice(index, 1);
        $scope.activities.splice(index, 1);
        Activity.remove({'id': id});
    };
    $scope.back = function () {
        $location.path('/view.cases/');
    };
    $scope.next = function () {
        $location.path('/view.approval/' + $scope.fid);
    };
}
;
function ApprovalCtrl($scope, $routeParams, $location, Approval, Activity, TimePeriod, TreatmentCase) {

    $scope.fid = $routeParams.fid;
    $scope.activities = Activity.query({fid: $scope.fid});
    $scope.periods = TimePeriod.query({fid: $scope.fid});
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
        TreatmentCase.remove({'id': id});
    };
    $scope.back = function () {
        $location.path('/view.activities/' + $scope.fid);
    };
    $scope.approve = function () {
        $location.path('/view.cases');
    };
}
;
function SuppliersCtrl($scope, Supplier) {

    $scope.currentSupplier = new Supplier();
    $scope.suppliers = Supplier.query();
    $scope.cancel = function () {
        $scope.currentSupplier = new Supplier();
    };
    $scope.save = function () {
        if (!$scope.suppliersForm.$invalid) {
            var isNew = $scope.currentSupplier.id == null;
            if (isNew) {
                $scope.currentSupplier = Supplier.save($scope.currentSupplier);
                $scope.suppliers.push($scope.currentSupplier);
            } else {
                $scope.currentSupplier = Supplier.$update($scope.currentSupplier);
            }
            $scope.cancel();
            $scope.suppliersForm.$setPristine();
        }
    };
    $scope.edit = function (supplier) {
        $scope.currentSupplier = supplier;
    };
    $scope.remove = function (index, id) {
        $scope.suppliers.splice(index, 1);
        Supplier.$remove({'id': id});
    };
}
;