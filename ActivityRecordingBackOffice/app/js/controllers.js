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
    $scope.activities = Approval.query(
        {fid: $scope.fid},
        function () {
            $scope.caseTime = CaseTime.get(
                {fid: $scope.fid},
                function (caseTime) {
                    // do nothing
                },
                function (err) {
                    alert("Im Service CaseTime.get ist ein Fehler aufgetreten: " + err);
                }
            )
        },
        function (err) {
            alert("Im Service Approval.get ist ein Fehler aufgetreten: " + err);
        }
    );
    $scope.caseTime = CaseTime.get(
        {fid: $scope.fid},
        function (caseTime) {
            // do nothing
        },
        function (err) {
            alert("Im Service CaseTime.get ist ein Fehler aufgetreten: " + err);
        }
    )
    $scope.currentTimePeriod = new TimePeriod();
    $scope.periods = TimePeriod.query({fid: $scope.fid});
    $scope.patient = Patient.get({fid: $scope.fid});
    $scope.suppliers = Supplier.query();
    
    $scope.createActivity = true;
    $scope.createPeriod = true;
    $scope.supplierName = '';
    $scope.tarmedDescription = '';
    $scope.duration = '';
    $scope.filterText = '';

    //Speichern einer bearbeiteten oder neuen Leistung
    $scope.saveActivity = function () {
        if (!$scope.activitiesForm.$invalid) {
            var container = new Activity();
            container.employeeId = $scope.currentActivity.employeeId;
            container.treatmentNumber = $scope.fid;
            container.tarmedActivityId = $scope.currentActivity.tarmedActivityId;
            container.number = $scope.currentActivity.number;

            if ($scope.createActivity) {
                // Für eine neue Leistung Anzahl übernehmen
                container.number = $scope.currentActivity.number;
            } else {
                // Beim Ändern einer Leistung nur Differenz der Anzahl setzen
                container.number = $scope.currentActivity.number - $scope.currentActivity._oldnumber;
            }
            container.$save(
                {},
                function () {
                    $scope.cancelActivity();
                    $scope.activitiesForm.$setPristine();
                    $scope.activities = Approval.query(
                        {fid: $scope.fid},
                        function () {
                            $scope.caseTime = CaseTime.get(
                                {fid: $scope.fid},
                                function (caseTime) {
                                    // do nothing
                                },
                                function (err) {
                                    alert("Im Service CaseTime.get ist ein Fehler aufgetreten: " + err);
                                }
                            )
                        },
                        function (err) {
                            alert("Im Service Approval.get ist ein Fehler aufgetreten: " + err);
                        }
                    );
                },
                function (err) {
                    alert("Im Service Activity.save ist ein Fehler aufgetreten: " + err);
                }
            );
        }
    };

    $scope.editActivity = function (activity) {
        $scope.createActivity = false;
        // Kopiere die Leistung
        $scope.currentActivity = new Activity();
        $scope.currentActivity.employeeId = activity.employeeId;
        $scope.currentActivity.treatmentNumber = activity.treatmentNumber;
        $scope.currentActivity.tarmedActivityId = activity.tarmedActivityId;
        $scope.currentActivity.number = activity.number;
        // Alte Anzahl sichern für die Berechnung der Differenz
        $scope.currentActivity._oldnumber = activity.number;
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
        container.$save(
                {},
                function (){
                    $scope.activities.splice(index, 1);
                    $scope.times = CaseTime.get({fid: $scope.fid});
                    $scope.currentActivity = new Activity();
                    $scope.createActivity = true;
                    $scope.caseTime = CaseTime.get(
                        {fid: $scope.fid},
                        function (caseTime) {
                            // do nothing
                        },
                        function (err) {
                            alert("Im Service CaseTime.get ist ein Fehler aufgetreten: " + err);
                        }
                    )
                },
                function (err){
                    alert("Im Service Activity.remove ist ein Fehler aufgetreten: " + err);
                }
        );
    };

    $scope.cancelActivity = function () {
        $scope.currentActivity = new Activity();
        $scope.supplierName = '';
        $scope.tarmedDescription = '';
        $scope.createActivity = true;
        $scope.filterText = '';
        $scope.activitiesForm.$setPristine();
    };
    
    $scope.isGenerated = function(tarmedActivityId){
        return tarmedActivityId === '00.0010' ||
               tarmedActivityId === '00.0020' ||
               tarmedActivityId === '00.0030' ||
               tarmedActivityId === '00.2285';
    }
    
    $scope.search = function (item){
        if (!$scope.isGenerated(item.id) && (item.id.indexOf($scope.filterText) != -1 || item.description.indexOf($scope.filterText) != -1)) {
            return true;
        }
        return false;
    };

    //TimePeriod Funktionen
    $scope.savePeriod = function () {
        var container = new TimePeriod({'timePeriodId': null, 'type': 'TREATMENT'});
        container.employeeId = $scope.currentTimePeriod.employeeId;
        container.treatmentNumber = $scope.fid;
        container.startTime = $scope.currentTimePeriod.startTime;
        container.endTime = $scope.currentTimePeriod.endTime;
        if ($scope.createPeriod) {
            container.$save().then(function () {
                $scope.periods = TimePeriod.query({fid: $scope.fid});
                $scope.activities = Approval.query({fid: $scope.fid});
                $scope.caseTime = CaseTime.get({fid: $scope.fid});
                $scope.cancel();
                $scope.timePeriodForm.$setPristine();
            });
        } else {
            container.timePeriodId = $scope.currentTimePeriod.timePeriodId;
            container.$update().then(function () {
                $scope.periods = TimePeriod.query({fid: $scope.fid});
                $scope.activities = Approval.query({fid: $scope.fid});
                $scope.caseTime = CaseTime.get({fid: $scope.fid});
                $scope.cancel();
                $scope.timePeriodForm.$setPristine();
            });
        }
    };

    $scope.editPeriod = function (period) {
        $scope.createPeriod = false;
        $scope.currentTimePeriod = period;
        $scope.supplierName = period.employeeId+': '+period.supplierLastname+' '+period.supplierFirstname;
        $scope.duration = $scope.getDuration(period.startTime, period.endTime );
    };

    $scope.cancelPeriod = function () {
        $scope.createPeriod = true;
        $scope.currentTimePeriod = new TimePeriod();
    };

    $scope.removePeriod = function (item) {
        var index = $scope.periods.indexOf(item);
        if (index === -1)
            return;
        TimePeriod.delete(
                {fid: item.timePeriodId},
                function () {
                    $scope.periods.splice(index, 1);
                    $scope.periods = TimePeriod.query({fid: $scope.fid});
                    $scope.activities = Approval.query({fid: $scope.fid});
                    $scope.caseTime = CaseTime.get({fid: $scope.fid});
                },
                function (err){
                    alert("Im Service TimePeriod.delete ist ein Fehler aufgetreten: " + err);
                }
        );
    };

    $scope.getDuration = function(start, end){
        var duration = getTimeDiff( start, end );
        return duration.hours + ' Std ' + duration.minutes + ' Min ' + duration.seconds + ' Sek';
    }

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
        approval.$save().then(
            function(){
                $location.path('/view.cases');
            }       
        );
        
    };
    
    $scope.getDuration = function(start, end){
        var duration = getTimeDiff( start, end );
        return duration.hours + ' Std ' + duration.minutes + ' Min ' + duration.seconds + ' Sek';
    }
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



function getTimeDiff( start, end ){
    var startTime = Date.parse(start);
    var endTime = Date.parse(end);
    var seconds = (endTime - startTime)/1000;
    var hours = Math.floor(seconds / (60 * 60));
    seconds = seconds - (hours * 60 *60);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    return {'hours': hours, 'minutes': minutes, 'seconds': seconds};
}