const { MongoClient } = require('mongodb');
var dbConnection;
var connectionString = "mongodb://localhost:27017/bookstore"

module.exports = {
    connectDB: (cb) => {
        MongoClient.connect(connectionString)
                    .then((client) => {
                        dbConnection = client.db(); //On Successful connection, we'll set database as dbConnection
                        return cb();
                    })
                    .catch((err) => {
                        console.log(err);
                        return cb(err);
                    })
    },
    getDB: () => dbConnection
}