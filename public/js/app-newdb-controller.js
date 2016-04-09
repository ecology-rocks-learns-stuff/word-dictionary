var app = angular.module("pouchapp");

//start the main controller
app.controller('NewDbCtrl', function($log, $scope, pouchDB) {
  var db = pouchDB('dictionaryDb');


  function error(err) {
    $log.error(err);
  }

  function get(res) {
    if (!res.ok) {
      return error(res);
    }
    return db.get(res.id);
  }

  function bind(res) {
    $scope.doc = res;
  }

    
    $scope.postDoc = function (newDoc) {
        db.post(newDoc)
        .then(get)
        .then(bind)
        .catch(error);
        
    };

});