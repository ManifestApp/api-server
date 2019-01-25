const express = require("express");
const bodyParser = require("body-parser");

const auth = require("./utils/authMiddleware").middleware;
const databaseAccess = require("./database/access");
const protestController = require("./controllers/protestController");
const protesterController = require("./controllers/protesterController");
const trustRelationController = require("./controllers/trustRelationController");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup postgres connection
databaseAccess.initialize();

// Setup routes
// Protest
app.post("/protest/search", protestController.findByLocation);
app.post("/protest", auth, protestController.create);
app.put("/protest", auth, protestController.update);
app.delete("/protest/:protestId", auth, protestController.delete);
app.get("/protester/protests", auth, protestController.findByCreator);

// Protester
app.post("/protester", protesterController.create);
app.put("/protester", auth, protesterController.update);
app.delete("/protester", auth, protesterController.delete);
app.post("/protester/join/:protestId", auth, protesterController.joinProtest);

// Trust relation
app.get("/trust", auth, trustRelationController.findByProtester);
app.post("/trust", auth, trustRelationController.create);
app.delete("/trust/:relationId", auth, trustRelationController.delete);
app.put("/trust/:relationId/fulfill", auth, trustRelationController.fulfill);
app.put("/trust/:relationId/expirationDate", auth, trustRelationController.updateRelationDate);


module.exports = app;