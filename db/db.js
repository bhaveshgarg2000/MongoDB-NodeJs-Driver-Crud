const MongoClient  = require('mongodb').MongoClient;

let dbConnection;
const url = "mongodb://localhost:27017/EventDB";

module.exports = {
    connectToDb: (cb)=>{
        MongoClient.connect(url)
        .then((client)=>{
            dbConnection = client.db();
            return cb();
        })
        .catch((err)=>{
            console.log(err);
            return cb(err);
        })
    },
    getDb: ()=> dbConnection 
};













// MongoClient.connect(url,(err, db) => {
//     if(err) throw err
//     const database = db.db('test')
//     console.log("Connected to DB");
//     db.close();
// });

