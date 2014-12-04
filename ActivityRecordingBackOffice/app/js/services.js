'use strict';
/* 
 * MLE Services
 */
var services = angular.module('services', ['ngResource', 'config']);

/*
 * Der REST-Service Patients gibt alle Behandlungsfaelle  * fuer Status 0, 1 oder 2 
 * zurueck. Der Status dient der Filterung der Behandlungsfaelle.
 * Status 0 = Alle, 1 = Patienten ohne Leistungen, 2 = Patienten mit Leistungen
 */
services.factory('Patients', function($resource, url) {
    return $resource(url + 'patients', {state: '@state'}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der REST-Service MyPatients gibt alle Behandlungsfaelle fuer einen
 * Leistungserbringer fuer Status 0, 1 oder 2 zurueck.
 * Der Status dient der Filterung der Behandlungsfaelle.
 * Status 0 = Alle, 1 = Patienten ohne Leistungen, 2 = Patienten mit Leistungen
 */
services.factory('MyPatients', function($resource, url) {
    return $resource(url + 'patients/supplier/:supplier', {supplier: '@supplier', state: '@state'}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der Rest-Service Patient gibt einen Behandlungsfall mit der Fallnummer fid zurueck
 */
services.factory('Patient', function($resource, url ) {
    return $resource(url + 'patients/treatment/:fid', {fid: '@fid'}, {
        'update': {method: 'PUT'}
    });
});


/*
 * Der REST-Service Suppliers gibt Leistungserbringer zurueck.
 */
services.factory('Supplier', function($resource, url) {
    return $resource(url + 'suppliers', {}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der Rest-Service TimePeriod gibt alle Zeitraeme zurueck
 */
services.factory('TimePeriod', function($resource, url ) {
    return $resource(url + 'timePeriods/treatment/:fid', {fid: '@fid'}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der Rest-Service StandardCatalogue gibt die Leistungen des Standardkatalogs
 * fuer den Mitarbeiter empNr mit der Anzahl bereits erfassten Leistungen zu einem
 * Behandlungsfall fid zurueck.
 */
services.factory('StandardCatalogue', function($resource, url) {
    return $resource(url + 'standardActivities/supplier/:empNr/:fid', {empNr: '@empNr', fid: '@fid'}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der Rest-Service Activity gibt die erfasste Leistung mit id zurueck.
 */
services.factory('Activity', function($resource, url ) {
    return $resource(url + 'activities/:fid', {fid: '@fid'}, {
        'update': {method: 'PUT'}
    });
});

/*
 * Der Rest-Service TreatmentCase gibt die erfasste Behandlungsfälle zurück.
 */
services.factory('TreatmentCase', function($resource, url ) {
    return $resource(url + 'treatmentCases', {}, {
        'update': {method:'PUT'}
    });
});

