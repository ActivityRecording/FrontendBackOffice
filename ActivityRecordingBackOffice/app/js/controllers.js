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
    $location.path('/view.cases/');
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

function ActivitiesCtrl($scope, $routeParams, $location, Approval, Activity, CaseTime, TimePeriod, Supplier, TarmedCatalogueService, Patient) {

    $scope.fid = $routeParams.fid;
    $scope.tarmed = TarmedCatalogueService;
    $scope.currentActivity = new Activity();
    $scope.activities = new Approval.query({fid: $scope.fid});
    $scope.caseTime = new CaseTime.get({fid: $scope.fid});
    $scope.currentTimePeriod = new TimePeriod();
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    $scope.currentSupplier = new Supplier();
    $scope.patient = Patient.get({fid: $scope.fid});
    $scope.suppliers = Supplier.query();
    
    $scope.createActivity = true;
    $scope.createPeriod = true;
    $scope.supplierName = '';
    $scope.tarmedDescription = '';
    $scope.duration = '';
    

    //Activity Funktionen
    $scope.saveActivity = function () {
        if (!$scope.activitiesForm.$invalid) {
            var container = new Activity();
            container.employeeId = $scope.currentActivity.supplier.employeeID;
            container.treatmentNumber = $scope.fid;
            container.tarmedActivityId = $scope.currentActivity.tarmedActivityId.id;
            container.number = $scope.currentActivity.number;
            $scope.empNr = $scope.currentActivity.number;

            //Zuweisung überprüfen
            var isNew = $scope.currentActivity.activityId == null;

            if (isNew) {
                container.$save({},
                        function () {
                            $scope.activities = Approval.query({fid: $scope.fid},
                            function () {
                                $scope.caseTime = CaseTime.get({fid: $scope.fid},
                                function (caseTime) {
                                    // do nothing
                                },
                                        function (err) {
                                            alert("Error in CaseTime.get" + err)
                                        }
                                )
                            },
                                    function (err) {
                                        alert("Error in Approval.get" + err)
                                    }
                            );
                        },
                        function (err) {
                            alert("Error in Activity.save" + err)
                        }
                );
            } else {
                container.$update(
                        {},
                        function () {
                            $scope.activities = Approval.query({fid: $scope.fid});
                        },
                        function (err) {
                            alert("Error in Approval.query" + err)
                        }
                );
            }
            $scope.cancelPeriod();
            $scope.activitiesForm.$setPristine();
        }
    };

    $scope.editActivity = function (activity) {
        $scope.createActivity = false;
        $scope.currentActivity = activity;
        $scope.supplierName = activity.supplierFirstname + ' ' + activity.supplierLastname;
        $scope.tarmedDescription = activity.tarmedActivityId + ' ' + activity.description;
    };

    $scope.removeActivity = function (item) {
        var index = $scope.activities.indexOf(item);
        if (index === -1)
            return;
        var container = new Activity();
        container.employeeId = item.employeeId;
        container.treatmentNumber = item.treatmentNumber;
        container.tarmedActivityId = item.tarmedActivityId;
        container.number = item.number * -1;
        container.$save().then(function () {
            $scope.activities.splice(index, 1);
            $scope.times = CaseTime.get({fid: $scope.fid});
        });
    };

    $scope.cancelActivity = function () {
        $scope.currentActivity = new Activity();
        $scope.createActivity = true;
    };



    //TimePeriod Funktionen
    $scope.savePeriod = function () {
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
    };

    $scope.editPeriod = function (period) {
        $scope.createPeriod = false;
        $scope.currentTimePeriod = period;
        $scope.supplierName = period.employeeId+': '+period.supplierLastname+' '+period.supplierFirstname;
        $scope.duration = getTimeDiff(period.startTime, period.endTime );
    };

    $scope.cancelPeriod = function () {
        $scope.createPeriod = true;
        $scope.currentTimePeriod = new TimePeriod();
    };

    $scope.removePeriod = function (item) {
        var index = $scope.periods.indexOf(item);
        if (index === -1)
            return;
        TimePeriod.delete({fid: item.timePeriodId},
        function () {
            $scope.periods.splice(index, 1);
            $scope.periods = TimePeriod.query({fid: $scope.fid});
            $scope.activities = Approval.query({fid: $scope.fid});
            $scope.caseTime = CaseTime.get({fid: $scope.fid});
        }
        );
    };



    $scope.back = function () {
        $location.path('/view.cases/');
    };
    $scope.next = function () {
        $location.path('/view.approval/' + $scope.fid);
    };
}
;
function ApprovalCtrl($scope, $routeParams, $location, Approval, CaseTime, TimePeriod, Patient) {

    $scope.fid = $routeParams.fid;
    $scope.activities = Approval.query({fid: $scope.fid});
    $scope.caseTime = CaseTime.get({fid: $scope.fid});
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    $scope.patient = Patient.get({fid: $scope.fid});

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
};


function getTimeDiff( t0, t1 )
{
    if (t0 < t1) { 
        var milisec_diff = t1 - t0;
    }else{
        var milisec_diff = t0 - t1;
    }
    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    var date_diff = new Date( milisec_diff );
    return days + " Days "+ date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes " + date_diff.getSeconds() + " Seconds";
}