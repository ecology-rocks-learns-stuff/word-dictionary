angular.controller('MainCtrl', function($log, $scope, pouchDB) {
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

    
    this.postDoc = function (newDoc) {
        db.post(newDoc)
        .then(get)
        .then(bind)
        .catch(error);
        
    };

});