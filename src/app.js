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

// body: { upperLeft, lowerRight }
app.post("/protest/search", protestController.findByLocation);

// body: { title, startingPosition, startingTime, ?description }
app.post("/protest", auth, protestController.create);

// body: { id, creator, title, startingPosition, startingTime, ?description }
app.put("/protest", auth, protestController.update);

app.delete("/protest/:protestId", auth, protestController.delete);

app.get("/protest/my", auth, protestController.findByCreator);

// Protester

// body: { deviceToken, ?nickname }
app.post("/protester", protesterController.create);

// body: { deviceToken, ?nickname }
app.put("/protester", auth, protesterController.update);

app.delete("/protester", auth, protesterController.delete);

app.post("/protester/join/:protestId", auth, protesterController.joinProtest);

// Trust relation

app.get("/trust/my", auth, trustRelationController.findByProtester);

// body: { ?expirationDate }
app.post("/trust", auth, trustRelationController.create);

app.delete("/trust/:relationId", auth, trustRelationController.delete);

app.put("/trust/:relationId/fulfill", auth, trustRelationController.fulfill);

// body: { expirationDate }
app.put("/trust/:relationId/expirationDate", auth, trustRelationController.updateRelationDate);

module.exports = app;