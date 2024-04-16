var express = require("express");
var cors = require("cors");
var app = express();
const port = 3000;

var expressWs = require("express-ws")(app);

var defaultRoute = require("./routes/defaultRoute");
var userRoute = require("./routes/userRoute");
var roomRoute = require("./routes/roomRoute");
var wordRoute = require("./routes/wordRoute");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", defaultRoute);
app.use("/user", userRoute);
app.use("/room", roomRoute);
app.use("/word", wordRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
