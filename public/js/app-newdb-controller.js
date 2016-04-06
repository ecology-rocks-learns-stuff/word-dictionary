angular.controller('MainCtrl', function($log, $scope, pouchDB) {
  var db = pouchDB('dbname');
  var doc = { name: 'David' };

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

  db.post(doc)
    .then(get)
    .then(bind)
    .catch(error);
});