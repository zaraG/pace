var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function (db, callback) {
  db.addColumn('participants', 'visibility', {type: 'string'}, callback);
};

exports.down = function (db, callback) {
  db.removeColumn('participants', 'visibility', callback);
};
