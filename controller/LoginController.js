const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const saltRounds = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = "server";
const loginRoute = express.Router();

const connection = require("../config/DB_config");

/* Get all */
loginRoute.get("/users", async (req, res) => {
  try {
    connection.query("SELECT * FROM `users`", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: "ไม่พบข้อมูล" });
      }
      res.json(results);
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

loginRoute.get("/users-join", async (req, res) => {
  try {
    connection.query("SELECT * FROM users inner join status on users.statusId = status.statusId", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: "ไม่พบข้อมูล" });
      }
      res.json(results);
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

/* Get by id */
loginRoute.get("/user/:id", async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM `users` WHERE `userId`=?", [req.params.id], (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.json({ status: "error", message: err });
        }
        res.json(results);
      }
    );
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//register
loginRoute.post("/register", jsonParser, async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      connection.execute(
        "INSERT INTO users (email, password, fname, lname, statusId) VALUES (?, ?, ?, ?, ?)",
        [
          req.body.email,
          hash, //password
          req.body.fname,
          req.body.lname,
          req.body.statusId,
        ],
        function (err, results, fields) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "Register successfully!!" });
        }
      );
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//Update user
loginRoute.put("/user/:id", jsonParser, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email, statusId } = req.body;
      connection.execute(
        "UPDATE users SET email=?, fname=?, lname=?, statusId=? WHERE userId=?",
        [email, fname, lname, statusId, userId],
        (err, results, fields) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "User update successfully" });
        }
      );
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//chang password user
loginRoute.put("/changePass-user/:id", jsonParser, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email, statusId } = req.body;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      connection.execute(
        "UPDATE users SET email=?, password=?, fname=?, lname=?, statusId=? WHERE userId=?",
        [email, hash, fname, lname, statusId, userId],
        (err, results, fields) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "Change password successfully" });
        }
      );
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

//delete user
loginRoute.delete("/user/:id", async (req, res, next) => {
  try{
  connection.execute(
    "DELETE FROM users WHERE userId=?",[req.params.id],(err, results, fields) => {
      if (err) {
        return res.json({ status: "error", message: 'Delete user incorrect' });
      }
      if(results.affectedRows === 0 ) {
        return res.json({status: "error",message:'No user with that id'})
      }
      res.json({ status: "Delete user successfully" });
    }
  );
  }catch(err){
    res.json({ status: "error", message:"Delete user incorrect" });
  }
});

/* login */
loginRoute.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no user found" });
        return;
      }
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign(
              {
                userId: users[0].userId,
                email: users[0].email,
                fname: users[0].fname,
                lname: users[0].lname,
                status: users[0].status,
              },
              secret
            );
            res.json({ status: "ok", message: "login success", token, users });
          } else {
            res.json({ status: "error", message: "login faild" });
          }
        }
      );
    }
  );
});

//check authen
loginRoute.post("/authen", jsonParser, function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

module.exports = loginRoute;
