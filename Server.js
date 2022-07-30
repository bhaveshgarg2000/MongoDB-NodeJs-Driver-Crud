const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;

// DB IMPORT
const {
    connectToDb,
    getDb
} = require('./db/db');
app.use(express.json());

// PORT
const port = 3000;

// DB Connection
connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
        db = getDb();
    }
});


//root route
app.get('/', (req, res) => {
    res.send("Hello World!");
})
// DATABASE CONNECTION
const url = "mongodb://localhost:27017/";
MongoClient.connect(url, (err, db) => {
    if (err) throw err
    const database = db.db('test')
    console.log("Connected to DB");
    db.close();
});


// ROUTES

//GET API
app.get('/app', (req, res) => {
    // let Events = [];
    db.collection('Events').find({})
        .toArray((err, result) => {
            if (err) return console.log(err)
            res.send(result)
        });
});

// PAGINATED API (PAGINATION)
app.get('/app/paginated', (req, res) => {
    const page = req.query.p || 0;
    const eventsPerPage = 3;
    let Events = [];
    db.collection('Events').find({})
        .skip(page * eventsPerPage)
        .limit(eventsPerPage)
        .toArray((err, result) => {
            if (err) return console.log(err)
            res.send(result)
        });
});

// POST REQUEST API

app.post('/app', (req, res) => {
    const event = req.body;
    db.collection('Events').insertOne(event).then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({
                err: "Could Not Create a Post"
            })
        });
});


// GET BY ID API REQUEST

app.get('/app/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Events')
            .findOne({
                _id: ObjectId(req.params.id)
            })
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({
                    err: "Could Not Get a Post"
                })
            });
    } else {
        res.status(500).json({
            err: "Invalid ID"
        })
    }
});


// DELETE API REQUEST

app.delete('/app/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Events')
            .deleteOne({
                _id: ObjectId(req.params.id)
            })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    err: "Could Not Delete a Post"
                });
            });
    } else {
        res.status(400).json({
            err: "Invalid ID"
        });
    }
});

// PATCH API

app.patch('/app/:id', (req, res) => {
    const updates = req.body;
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Events')
            .updateOne({
                _id: ObjectId(req.params.id)
            }, {
                $set: updates
            })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    err: "Could Not Update a Post"
                });
            });
    } else {
        res.status(400).json({
            err: "Invalid ID"
        });
    }

});

