const express = require("express");

const createRoutes = require("./routes/index");

const app = express();

const port = process.env.PORT || 9876;

app.use(express.static('static'));

// Adding routing logieng
createRoutes(app);

app.listen(port, () => console.log(`App is started on port: ${port}`));
