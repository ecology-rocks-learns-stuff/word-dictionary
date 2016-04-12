/*jslint node: true*/
/*jslint nomen: true*/
/*global angular*/
/*global PouchDB*/
/*jslint es5: true */
'use strict';

/* My problem is in this file and how the pouchDB service handles saves / listening */  

var app = angular.module("pouchapp");

//start the main controller
app.controller("MainController", ['$scope', '$log', '$rootScope', '$state', '$stateParams', '$pouchDB', function ($scope, $log, $rootScope, $state, $stateParams, $pouchDB) {
        
    //initiate $scope items
    $scope.items = {};

    //initialize service?
    $pouchDB.startListening();
// Listen for changes which include create or update events
    $rootScope.$on("$pouchDB:change", function (event, data) {
        $scope.items[data.doc._id] = data.doc;
        $scope.$apply();
        //$pouchDB.stopListening();
        //$pouchDB.startListening();
    });

// Listen for changes which include only delete events
    $rootScope.$on("$pouchDB:delete", function (event, data) {
        delete $scope.items[data.doc._id];
        $scope.$apply();
    });

// Look up a document if we landed in the info screen for editing a document
    if ($stateParams.documentId) {
        $pouchDB.get($stateParams.documentId).then(function (result) {
            $scope.inputForm = result;
        });
    }

// Save a document with either an update or insert
    $scope.save = function (firstname, lastname, email) {
        console.log("controller save!");
        var jsonDocument = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email
        };
    // If we're updating, provide the most recent revision and document id
        if ($stateParams.documentId) {
            jsonDocument._id = $stateParams.documentId;
            jsonDocument._rev = $stateParams.documentRevision;
        }
        $pouchDB.save(jsonDocument).then(function (response) {
            $state.go("list");
        }, function (error) {
            console.log("ERROR -> " + error);
        });
    };

    $scope.delete = function (id, rev) {
        $pouchDB.delete(id, rev);
    };

    
    //code from other app
      function error(err) {
    $log.error(err);
  }

  function get(res) {
    if (!res.ok) {
      return error(res);
    }
  }

  function bind(res) {
    $scope.doc = res;
  }

    
    $scope.postDoc = function (newDoc) {
        $pouchDB.save(newDoc)
        .then(get)
        .then(bind)
        .catch(error);
        
    };
}]); //end controller

