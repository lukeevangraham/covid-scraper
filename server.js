let express = require("express");
let Handlebars = require('handlebars')
let exphbs = require("express-handlebars");
let mongoose = require("mongoose");
let {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

let PORT = process.env.PORT || 8080;

let app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers"),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", "handlebars");

let routes = require("./config/routes.js");
app.use(routes);

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});

var db = process.env.MONGODB_URI || "mongodb://localhost/covidStats";

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }),
  function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log("mongoose connections is successful");
    }
  };
