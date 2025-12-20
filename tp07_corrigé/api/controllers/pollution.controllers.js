const { Op } = require("sequelize");
const db = require("../models");
const Pollutions = db.Pollutions;

//Utilisation :
//GET /api/pollutions
//GET /api/pollutions?titre=deversement
//GET /api/pollutions?lieu=Marseille
//GET /api/pollutions?typePollution=DEPOT_SAUVAGE
//GET /api/pollutions?titre=dechet&typePollution=DEPOT_SAUVAGE&lieu=Paris
exports.findAll = async (req, res) => {

    const { lieu, typePollution, titre } = req.query;

    const where = {};

    if (lieu) {
      where.lieu = { [Op.iLike]: `%${lieu}%` };
    }

    if (typePollution) {
      where.typePollution = { [Op.iLike]: `%${typePollution}%` };
    }

    if (titre) {
      where.titre = { [Op.iLike]: `%${titre}%` };
    }

    Pollutions.findAll( {where})
    .then(data => res.send(data))
    .catch(err => res.status(400).send({ message: err.message }));
};

exports.findById = (req, res) => {

  const id = req.params.id;
  Pollutions.findByPk(id)
  .then(data => {
    if (!data) {
      return res.status(404).send({
        message: `Pollution avec l'ID ${id} non trouvé`
      });
    }
    res.send(data);
  })
  .catch(err => {
    console.error(`Erreur lors de la recherche de la pollution avec l'ID ${id} : `, err);
    res.status(400).send({ message: err.message });
  });
};

exports.create = async (req, res) => {

  const pollution = {
    titre,
    typePollution,
    description,
    lieu,
    dateObservation,
    latitude,
    longitude,
    photoUrl
  } = req.body;

  if (!titre) {
    return res.status(400).json({ message: "Le champ 'titre' est obligatoire." });
  }
  if (!typePollution) {
    return res.status(400).json({ message: "Le champ 'type_pollution' est obligatoire." });
  }
  if (!description) {
    return res.status(400).json({ message: "Le champ 'description' est obligatoire." });
  }
  if (!lieu) {
    return res.status(400).json({ message: "Le champ 'lieu' est obligatoire." });
  }
  if (!dateObservation) {
    return res.status(400).json({ message: "Le champ 'date_observation' est obligatoire." });
  }
  if (!latitude) {
    return res.status(400).json({ message: "Le champ 'latitude' est obligatoire." });
  }
  if (!longitude) {
    return res.status(400).json({ message: "Le champ 'longitude' est obligatoire." });
  }

  Pollutions.create(pollution)
  .then(data => {
    res.status(201).send({
      message: "Pollution créée avec succès.",
      pollution: data
    });
  })
  .catch(err => {
    console.error("Erreur lors de la création d'une pollution : ", err);
    res.status(500).send({ message: err.message });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  if (!Object.keys(req.body).length) {
    return res.status(400).send({
      message: "Le corps de la requête est vide. Aucun champ à mettre à jour."
    });
  }

  Pollutions.update(req.body, {
    where: { id: id }
  })
  .then(data => {
    res.status(201).send({
      message: "Pollution mis à jour avec succès.",
      pollution: data
    });
  })
  .catch(err => {
    console.error(`Erreur lors de la mise à jour de la pollution avec l'ID ${id} : `, err);
    res.status(500).send({ message: err.message });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Pollutions.destroy({
    where: { id: id }
  })
  .then(data => {
    res.status(201).send({
      message: "Pollution supprimé"
    });
  })
  .catch(err => {
    console.error(`Erreur lors de la suppression de la pollution avec l'ID ${id} : `, err);
    res.status(500).send({ message: err.message });
  });
};

