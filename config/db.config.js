var mongoClient = require('mongodb').MongoClient;

var localUrl = "mongodb://localhost:27017/blogDb";

var url = "mongodb://akhil:akhil123@ds255265.mlab.com:55265/triposse";

module.exports.connect = function connect(callback){
  mongoClient.connect(url, function(err, conn){
    module.exports.db = conn;
    callback(err);
  });
}
