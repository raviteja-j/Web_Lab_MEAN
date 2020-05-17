var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = 3000;
const HOST = "192.168.99.100";
app.listen(PORT);
console.log("Sever running sat http://" + HOST + ":" + PORT);
MongoClient.connect("mongodb://mongo/db", function (err, db) {
  if (!err) {
    console.log("Connected to Database");

    app.use(express.static(__dirname + "/public"));
    app.use(bodyParser.json());
    app.get("/", function (req, res) {
      res.sendFile(__dirname + "/" + "index.html");
    });

    app.get("/index.html", function (req, res) {
      res.sendFile(__dirname + "/" + "index.html");
    });

    app.get("/insert.html", function (req, res) {
      res.sendFile(__dirname + "/" + "insert.html");
    });

    //-----------------------INSERT----------------------------

    app.post("/insert_post", function (req, res) {
      console.log(req.body);
      res.setHeader("Content-Type", "text/html");
      console.log(
        "Sent data are: Title :" + req.body.title + " ISBN =" + req.body.isbn
      );
      entry = {
        title: req.body.title,
        isbn: req.body.isbn,
        author: req.body.author,
      };
      db.collection("books").insert(entry);
      res.end(JSON.stringify(entry));
    });

    //--------------UPDATE---------------------------------------

    app.get("/update.html", function (req, res) {
      res.sendFile(__dirname + "/" + "update.html");
    });

    app.post("/update_post", function (req, res) {
      res.setHeader("Content-Type", "text/html");
      db.collection("books", function (err, data) {
        data.update(
          { isbn: req.body.isbn },
          { $set: { title: req.body.title, author: req.body.author } },
          { multi: true },
          function (err, result) {
            if (err) {
              res.status(400).send(JSON.stringify({ msg: "Update failed" }));
              console.log("Failed to update data.");
            } else {
              res.send(JSON.stringify(result.result));
              console.log("Book Updated");
            }
          }
        );
      });
    });

    //--------------SEARCH------------------------------------------

    app.get("/search.html", function (req, res) {
      res.sendFile(__dirname + "/" + "search.html");
    });

    app.post("/search_post", function (req, res) {
      var field = req.body.option;
      var value = req.body.value;
      db.collection("books")
        .find({ [field]: value }, { _id: 0 })
        .toArray(function (err, result) {
          if (err) {
            console.log(err.message + "Failed to access data");
          } else {
            console.log(result);
            res.status(200).json(result);
          }
        });
    });

    //--------------DELETE------------------------------------------

    app.get("/delete.html", function (req, res) {
      res.sendFile(__dirname + "/" + "delete.html");
    });

    app.post("/delete_post", function (req, res) {
      console.log("hi");
      var field = req.body.option;
      var value = req.body.value;
      db.collection("books", function (err, data) {
        data.remove({ [field]: value }, function (err, result) {
          if (err) {
            res.status(400).send(JSON.stringify({ msg: "Failed to remove" }));
            console.log("Failed to delete data.");
          } else {
            res.send(JSON.stringify(result.result));
            console.log("Books deleted");
          }
        });
      });
    });

    //--------------DISPLAY-----------------------------------------

    app.get("/display.html", function (req, res) {
      res.sendFile(__dirname + "/" + "display.html");
    });

    app.post("/display_post", function (req, res) {
      var field = req.body.option;
      var value = req.body.value;
      db.collection("books")
        .find({ [field]: value }, { _id: 0 })
        .toArray(function (err, result) {
          if (err) {
            console.log(err.message + "Failed to access data");
          } else {
            console.log(result);
            res.status(200).json(result);
          }
        });
    });
  } else {
    db.close();
  }
});
