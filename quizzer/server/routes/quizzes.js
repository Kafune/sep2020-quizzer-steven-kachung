const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

require("./../model/quiz");
require("./../model/team");

const express = require("express");
const e = require("express");
const quizzes = express.Router();

const Quiz = mongoose.model("Quiz");

quizzes.get("/", async (req, res) => {
  // Haal alle quizzes op
  res.send(await Quiz.find());
});

quizzes.get("/:password", async (req, res) => {
  // Haal alle quizzes op, op basis van het ingevoerde wachtwoord
  res.send(await Quiz.findOne({ password: req.params.password }));
});

// quizzes.get('/:quizId', async (req, res) => {
//     // Haal een quiz op
//     const quiz = await Quiz.findById(req.params.quizId);
//     res.send(quiz);
// });

//create a new quiz
quizzes.post("/", async (req, res) => {
  // if(req.session.role == 'quizmaster') {
  const quizRoomInfo = {
    password: null,
    round: {
      number: 1,
      questionNumber: 1,
      chosen_categories: [],
      chosen_questions: [],
    },
    teams: [],
  };

  const databasePassword = (password) => {
    return Quiz.findOne({ password: password });
  };
  //generate random quiz room password
  quizRoomInfo.password = Math.random().toString(36).substr(2, 7);

  // check if generated password exists in database
  // generate a new password if that's the case
  if (databasePassword(quizRoomInfo.password) == quizRoomInfo.password) {
    quizRoomInfo.password = Math.random().toString(36).substr(2, 7);
  }

  const quiz = new Quiz(quizRoomInfo);

  await quiz.save();

  req.session.role = req.body.role;
  req.session.quiz_id = quiz._id;

  res.send(quiz);
  // } else {
  //     res.send({result: "error", message: "Not enough priviledges"})
  // }
});

//TEAMS
quizzes.get("/:quizId/teams", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  res.send(quiz.teams);
});

// Get specific team
quizzes.get("/:quizId/teams/:teamId", async (req, res) => {
  // {$elemMatch:{_id: req.params.teamId}}
  let conditions = {
    _id: req.params.quizId,
    "teams._id": { $eq: req.params.teamId },
  };

  const quiz = await Quiz.findOne(conditions);
  console.log(quiz);

  res.send(quiz);
});

//sign in as team
quizzes.post("/:quizId/teams", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
    "teams._id": { $ne: req.body.name },
  };

  let update = {
    $addToSet: {
      teams: {
        _id: req.body.name,
        score: 0,
        status: "not_accepted",
        answer: "",
        questions_answered: 0,
      },
    },
  };

  let checkPassword = await Quiz.exists({ password: req.body.password });

  if (checkPassword) {
    await Quiz.findOneAndUpdate(
      conditions,
      update,
      { new: true },
      (err, doc) => {
        if (err) {
          res.send("This team already exists!");
        } else {
          req.session.role = "client";
          req.session.teamname = req.body.name;
          res.send(doc);
        }
      }
    );
  } else {
    res.send("incorrect password");
  }
  //send a message get_teams to quiz master in this part.
});

//accept team
quizzes.put("/:quizId/teams", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  //is the room full?
  if (quiz.teams.length <= 6) {
    // does team exist already?
    if (quiz.teams.find((teams) => teams._id == req.body.name) != undefined) {
      // quiz.teams.push(req.body.teamName);
      quiz.teams.find((teams) => teams._id == req.body.name).status =
        "accepted";
    } else {
      res.send({ result: "error", message: "team does not exist!" });
    }
  } else {
    res.send({
      result: "error",
      message: "maximum amount of teams in the quiz",
    });
  }

  await quiz.save();
  res.send(quiz);
});

//delete quiz
quizzes.delete("/:quizId", async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.quizId, (err) => {
    if (err) res.send(err);
    req.session.destroy;
    res.send({ result: "ok", message: "Quiz night ended" });
  });
});

//possibility for a team to change name
quizzes.put("/:quizId/teams/:teamName", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
    "teams._id": { $in: [req.params.teamName] },
  };

  let update = {
    $set: {
      "teams.$._id": req.body.name,
    },
  };

  await Quiz.findOneAndUpdate(conditions, update, { new: true }, (err, doc) => {
    if (err) {
      res.send("This teamname already exists!");
    } else {
      req.session.teamname = req.body.name;
      res.send(doc);
    }
  });
});

//delete team from quiz
quizzes.delete("/:quizId/teams", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  const currentTeam = quiz.teams.filter((team) => {
    return team._id == req.body.name;
  });
  // console.log(currentTeam[0]._id);

  //TODO: Somehow destroy the session of the declined user
  //pull first result of a team from the teams list
  await quiz.teams.pull(currentTeam[0]._id);
  await quiz.save();
  res.send(quiz);
});

//Get all chosen categories in a quiz
quizzes.get("/:quizId/categories", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  const chosencategories = {
    categories: quiz.round.chosen_categories,
  };
  res.send(chosencategories);
});

//Add new categories to a quiz round
quizzes.put("/:quizId/categories", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  const chosencategories = {
    categories: quiz.round.chosen_categories,
  };
  if (chosencategories.categories.length > 2) {
    res.send(quiz);
  } else {
    let conditions = {
      _id: req.params.quizId,
    };
    let update = {
      $addToSet: { "round.chosen_categories": req.body.category },
    };
    await Quiz.findOneAndUpdate(
      conditions,
      update,
      { new: true },
      (err, doc) => {
        if (err) {
          res.send("Er is een fout");
        } else {
          res.send(doc);
        }
      }
    );
  }
});

quizzes.put("/:quizId/questions", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
  };
  let update = {
    $addToSet: { "round.chosen_questions": req.body.question },
  };
  await Quiz.findOneAndUpdate(conditions, update, { new: true }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

quizzes.get("/:quizId/questions", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  const chosencategories = {
    questions: quiz.round.chosen_questions,
  };
  res.send(chosencategories);
});

//A team that answers a question
quizzes.put("/:quizId/questions/answers", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
    "teams._id": { $in: [req.body.team] },
  };

  let update = {
    $set: {
      "teams.$.answer": req.body.answer,
    },
  };

  await Quiz.findOneAndUpdate(conditions, update, { new: true }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

//quizmaster approves or denies question
quizzes.put("/:quizId/questions/approval", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
    "teams._id": req.body.team,
  };
  console.log(req.body.team);

  // als de vraag goed is, increment deze waarde met 1
  let update = {
    $inc: {
      "teams.$.questions_answered": 1,
    },
  };

  const quiz = await Quiz.findOneAndUpdate(conditions, update, {
    new: true,
  }).exec();

  res.send(quiz);
});

//request from the quiz master to create a new round
quizzes.put("/:quizId/round/new", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
  };

  let update = {
    $set: {
      "round.chosen_categories": [],
      "round.chosen_questions": [],
      "round.questionNumber": 1,
      "teams.$[].questions_answered": 0,
      "teams.$[].answer": "",
    },
    $inc: {
      "round.number": 1,
    },
  };

  const quiz = await Quiz.findOneAndUpdate(conditions, update, {
    new: true,
  }).exec();
  console.log(quiz);
  res.send(quiz);
});

quizzes.put("/:quizId/questions/points", async (req, res) => {
  let conditions = {
    _id: req.params.quizId,
    "teams._id": { $in: [req.body.team] },
  };

  let update = {
    $set: {
      "teams.$.score": req.body.score,
    },
  };

  await Quiz.findOneAndUpdate(conditions, update, { new: true }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

quizzes.get("/:quizId/points", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId)
    .select("teams.score teams._id -_id")
    .exec(function (err, docs) {
      res.send(docs);
    });
});

quizzes.post("/login", async (req, res) => {
  let checkPassword = await Quiz.exists({ password: req.body.password });

  if (checkPassword) {
    const quizId = await Quiz.findOne({ password: req.body.password });
    res.send({
      quizId: quizId._id,
      loggedIn: true,
    });
  } else {
    res.send({
      error: true,
      message: "Quiz is not found",
    });
  }
});

module.exports = quizzes;
