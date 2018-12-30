const mongoDb = require('mongodb');
const csvReader = require('./csvReader')

const MongoClient = mongoDb.MongoClient;
const dbUrl = 'mongodb://localhost:27017';

let _db;


let initDb = (callback, dbName) => {
    if(_db) {
        console.log('Database is already intialized');
        return callback(null, _db);
    }

    return MongoClient.connect(dbUrl,  { useNewUrlParser: true }).then(client => {
        _db = client.db(dbName);
        callback(null, _db);
    }).catch(err => {
        callback(err);
    })
}

let getDb = () => {
    if(!_db) {
        throw Error('Database not initialized');
    }
    return _db;
}

let clearCollection = async function (collectionName) {
    await _db.collection(collectionName).deleteMany({});
}

module.exports = {
    initDb,
    getDb,
    clearCollection
}