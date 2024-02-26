const session = require("../controller/session");
const { Router } = require("express");

const app = Router();

app.post("/add_data", session.addData);
app.put("/add_data/:user_uid", session.updateData);
app.get("/get_count", session.getCount);

module.exports = app;