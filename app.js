const express = require('express');
const { connectDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json()); // Middleware to parse any body data

let db;
//DB Connection
connectDB((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log("Connected to db and listening on port number 3000");
        })
        db = getDB(); // On successful connection get the Database
    }
    else {
        console.log("Some error(s) occurred while trying to connect to the database!");
    }
});

// Get all data
app.get('/books', (req, res) => {
    let pageNo = req.query.pageNo || 0;
    let pageSize = 3;
    let booksList = [];

    db.collection('books')
      .find()
      .sort({ title: 1 })
      .skip(pageNo*pageSize)
      .limit(pageSize)
      .forEach(book => {
        booksList.push(book);
      })
      .then(() => {
        res.status(200).json(booksList);
      })
      .catch((err) => {
        res.status(404).json({message: "Couldn't fetch all data"});
      });
})

// Get a specific data
app.get('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
          .findOne({_id: new ObjectId(req.params.id)})
          .then((doc) => {
            if(doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(200).json({message:"No Records Found with this id"});
            }
          })
          .catch((err) => {
            res.status(404).json({message: "Couldn't fetch all data"});
          });
    }
    else {
        res.status(404).json({message: "Invalid Object Id"})
    }
})

// CREATE A SINGLE DOC
app.post('/books',(req, res) => {
    let book = req.body;

    db.collection('books')
      .insertOne(book)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      })
})

// CREATE MANY DOCS
app.post('/books/multiple',(req, res) => {
    let books = req.body;

    db.collection('books')
      .insertMany(books)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      })
})

// DELETE
app.delete('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
          .deleteOne({_id: new ObjectId(req.params.id)})
          .then((result) => {
            if(result) {
                res.status(200).json({result, "message" : "Deleted Successfully"});
            }
            else {
                res.status(200).json({message:"No Records Found with this id"});
            }
          })
          .catch((err) => {
            res.status(404).json({message: "Couldn't fetch all data"});
          });
    }
    else {
        res.status(404).json({message: "Invalid Object Id"})
    }
})

// UPDATE/PATCH
app.patch('/books/:id', (req, res) => {
    let updatedBody = req.body;

    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
          .updateOne({_id: new ObjectId(req.params.id)}, {$set: updatedBody})
          .then((result) => {
            if(result) {
                res.status(200).json({result, "message" : "Updated Successfully!"});
            }
          })
          .catch((err) => {
            res.status(404).json({message: "Couldn't fetch all data"});
          });
    }
    else {
        res.status(404).json({message: "Invalid Object Id"})
    }
})