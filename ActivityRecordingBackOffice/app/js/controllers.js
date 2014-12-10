/* 
 * MLE Backoffice Controllers
 */
'use strict';
var controllers = angular.module('controllers', ['services']);
function MenuCtrl($scope, $route, $routeParams, $location, TarmedCatalogueService) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    TarmedCatalogueService.copyCatalogue(); 
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

function ActivitiesCtrl($scope, $routeParams, $location, Approval, Activity, CaseTime, TimePeriod, Supplier, TarmedCatalogueService) {

    $scope.fid = $routeParams.fid;
    $scope.tarmed = TarmedCatalogueService;
    $scope.currentActivity = new Activity();
    $scope.activities = new Approval.query({fid: $scope.fid});
    $scope.caseTime = new CaseTime.get({fid: $scope.fid});
    $scope.currentTimePeriod = new TimePeriod();
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    $scope.currentSupplier = new Supplier();
    $scope.suppliers = Supplier.query();


    $scope.save = function (type) {
        //Activity
        if (type === 0) {
            if (!$scope.activitiesForm.$invalid) {
                var container = new Activity();
                container.employeeId = $scope.currentActivity.supplier.employeeID;
                container.treatmentNumber = $scope.fid;
                container.tarmedActivityId = $scope.currentActivity.tarmedActivityId;
                container.number = $scope.currentActivity.number;

                var isNew = $scope.currentActivity.activityId == null;
                if (isNew) {
                    container.$save().then(function () {
                        $scope.activities = Approval.query({fid: $scope.fid});
                        
                        CaseTime.get({fid: $scope.fid}).then(function (caseTime) {
                            $scope.caseTime = caseTime;
                        });
                    }, function (err) {
                        // No activies found
                    });
//                   var promise = null ;
//                   container.$save().then(function(){
//                        $scope.activities = Approval.query({fid: $scope.fid});
//                        promise = $scope.activities.$promise;
//                    });
//                    promise.then(function () {
//                        $scope.caseTime = CaseTime.get({fid: $scope.fid});
//                    });
                } else {
                    container.$update().then(function () {
                        $scope.activities = Approval.query({fid: $scope.fid});
                        promise = $scope.activities.$promise;
                    });
                }
                $scope.cancel();
                $scope.activitiesForm.$setPristine();
            }
        }
        //TimePeriod
        if (type === 1) {
            if (!$scope.timePeriodForm.$invalid) {
                var isNew = $scope.currentTimePeriod.timePeriodId == null;
                var container = new TimePeriod({'timePeriodId': null, 'type': 'TREATMENT'});
                container.employeeId = $scope.currentTimePeriod.supplier.employeeID;
                container.treatmentNumber = $scope.fid;
                container.startTime = $scope.currentTimePeriod.startTime;
                container.endTime = $scope.currentTimePeriod.endTime;
                if (isNew) {
                    container.$save().then(function () {
                        $scope.periods = TimePeriod.query({fid: $scope.fid});
                        $scope.activities = Approval.query({fid: $scope.fid});
                        $scope.caseTime = CaseTime.get({fid: $scope.fid});
                    });
                } else {
                    container.$update().then(function () {
                        $scope.periods = TimePeriod.query({fid: $scope.fid});
                        $scope.activities = Approval.query({fid: $scope.fid});
                        $scope.caseTime = CaseTime.get({fid: $scope.fid});
                    });
                }
                $scope.cancel();
                $scope.timePeriodForm.$setPristine();
            }
        }
    };

//    $scope.onTimeSet = function (newDate, oldDate) {
//        console.log(newDate);
//        console.log(oldDate);
//    }

    $scope.editPeriod = function (period) {
        $scope.currentTimePeriod = period;
    };

    $scope.removePeriod = function (index, id) {
        $scope.periods.splice(index, 1);
        TimePeriod.$remove({'fid': id});
    };

    $scope.cancelPeriod = function () {
        $scope.currentTimePeriod = new TimePeriod();
    };

    $scope.editActivity = function (activity) {
        $scope.currentActivity = activity;
    };

    $scope.removeActivity = function (index, id) {
        $scope.activities.splice(index, 1);
        Activity.$remove({'fid': id});
    };

    $scope.cancelActivity = function () {
        $scope.currentActivity = new Activity();
    };

    $scope.back = function () {
        $location.path('/view.cases/');
    };
    $scope.next = function () {
        $location.path('/view.approval/' + $scope.fid);
    };
}
;
function ApprovalCtrl($scope, $routeParams, $location, Approval, CaseTime, TimePeriod) {

    $scope.fid = $routeParams.fid;
    $scope.activities = Approval.query({fid: $scope.fid});
    $scope.caseTime = CaseTime.get({fid: $scope.fid});
    $scope.periods = TimePeriod.query({fid: $scope.fid});

    $scope.back = function () {
        $location.path('/view.activities/' + $scope.fid);
    };

    $scope.approve = function () {
        var approval = new Approval({fid: $scope.fid});
        approval.$save();
        $location.path('/view.cases');
    };
}
;

function SuppliersCtrl($scope, Supplier) {

    $scope.currentSupplier = new Supplier();
    $scope.suppliers = Supplier.query();

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

    $scope.cancel = function () {
        $scope.currentSupplier = new Supplier();
    };

    $scope.remove = function (index, id) {
        $scope.suppliers.splice(index, 1);
        Supplier.$remove({'id': id});
    };
}
;