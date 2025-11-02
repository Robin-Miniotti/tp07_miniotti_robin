

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
  

    // login utilisateur
    router.post("/login", utilisateur.login);
    router.get("/", utilisateur.get);
    router.post("/", utilisateur.create);
  
    app.use('/api/utilisateur', router);
  };
