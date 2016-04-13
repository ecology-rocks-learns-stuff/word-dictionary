/*jslint node: true nomen: true*/
/*global angular*/
/*global PouchDB*/
/*jslint es5: true */
'use strict';

angular.module("pouchapp", ["ui.router", "pouchdb"])


//This piece of code says to run this function after loading.
//Essentially, it sets the database in $pouchDB, to nraboy-test
//And sets the sync to local.
//This run runs $pouchDB, which is listed as a SERVICE below.
    .run(['$pouchDB', function ($pouchDB) {
        $pouchDB.setDatabase("nraboy-test");
        //$pouchDB.sync("http://localhost:4984/test-database");
    }]) //end run


//I believe this section runs before run (), 
//because it performs ON module loading.

//this is actually a routing area.
//when the URL is "list" then you go to the list template
//when the URL is item, you go to the item template
//list is the default view.
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("list", {
                "url": "/list",
                "templateUrl": "templates/list.html",
                "controller": "MainController"
            })
            .state("item", {
                "url": "/item/:documentId/:documentRevision",
                "templateUrl": "templates/item.html",
                "controller": "MainController"
            });
        $urlRouterProvider.otherwise("list");
    }])








    .service("$pouchDB", ["$rootScope", "$q", function ($rootScope, $q) {

        var database, changeListener, changeOnce;

        //set the database, which now inherits all properties of new PouchDB
        this.setDatabase = function (databaseName) {
            //database is global (from above)
            database = new PouchDB(databaseName);
        };

        
        //startListening is a function that watches for realtime db updates
        //if one happens, then it broadcasts to the rootscope with change or
        //delete.
        this.startListening = function () {
            //changes gives realtime updates to the database
            //adding since.now will only go from this point forward
            console.log("I'm listening again");
            //if (!changeOnce) {
                changeListener = database.changes({
                    live: true,
                    //_maxListeners: 1,
                    include_docs: true
                }).on("change", function (change) {
                    if (!change.deleted) {
                        $rootScope.$broadcast("$pouchDB:change", change);
                    } else {
                        $rootScope.$broadcast("$pouchDB:delete", change);
                    }
                });
                console.log(changeListener);
              //  changeOnce = true;
            //}
        };
        
        //cancel() is a method that gets inherited from changes(), 
        //it tells the changeListener to stop monitoring.
        this.stopListening = function () {
            changeListener.cancel();
            changeListener = null;
        };

        //this would sync to a remote database, which needs
        //to be passed into this function.
        this.sync = function (remoteDatabase) {
            database.sync(remoteDatabase, {live: true, retry: true});
        };

        
        //This is a deferred / promises way of saving a document to the database
        //The bulk of the code has to do with if/else on the _id character
        this.save = function (jsonDocument) {
            //establish deferred as a type of $q.defer()
            console.log("factory save!");
            var deferred = $q.defer();
            //if there is not an _id given with the document, e.g., its new, 
            //post the document to the database
            if (!jsonDocument._id) {
                database.post(jsonDocument).then(function (response) {
                    deferred.resolve(response);
                    //changeListener.stopListening();
                }).catch(function (error) {
                    deferred.reject(error);
                });
            } else {
                database.put(jsonDocument).then(function (response) {
                    deferred.resolve(response);
                    //console.log(changeListener);
                    changeListener.stopListening();
                    //console.log(changeListener);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }
            console.log(changeListener);
            //changeListener.stopLifstening();
            return deferred.promise;
        };
        
        
        
        //delete an item from the database
        this.delete = function (documentId, documentRevision) {
            return database.remove(documentId, documentRevision);
        };

        this.get = function (documentId) {
            return database.get(documentId);
        };

        this.destroy = function () {
            database.destroy();
        };

    }])


.service('$newPouchDB', function(pouchDB) {
  var db = pouchDB('name');
});
