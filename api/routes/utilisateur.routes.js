

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
  

    // login utilisateur
    router.post("/login", utilisateur.login);
    router.get("/", utilisateur.get);
    router.post("/", utilisateur.create);
    router.delete("/:id", utilisateur.delete);    
  
    app.use('/api/utilisateur', router);
  };
