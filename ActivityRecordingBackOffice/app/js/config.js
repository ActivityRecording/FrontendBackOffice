/** 
 * AngularJS Module for configuration purposes - Defines alot of constants,
 * which can be injected everywhere they're needed
 */

var config = angular.module('config',[]);                           
config.constant('url', 'http://192.168.1.103:8080/MLEBackend/webresources/');
//config.constant('url', 'http://192.168.0.10:8080/MLEBackend/webresources/');
//config.constant('employeeNr',10101);
