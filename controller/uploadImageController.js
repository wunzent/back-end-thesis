const express = require("express");
const imageRoute = express.Router();
const dbcofig = require("../config/DB_config");

const multer = require("multer");
var fs = require("fs");
const path = require("path");

var dir = "./uploads";   // PATH TO UPLOAD FILE
if (!fs.existsSync(dir)) {  // CREATE DIRECTORY IF NOT FOUND
  fs.mkdirSync(dir, { recursive: true });
}

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type")
    error.code = "LIMIT_FILE_TYPES"
    return cb(error, false)
  }
  cb(null, true);
};
const MAX_SIZE = 500000;
const upload = multer({
  storage: fileStorageEngine,
  fileFilter,/* : (req, file, cb) => {
        const allowedTypes = ["image/jpeg" ,"image/jpg" ,"image/png" ]
        if (!allowedTypes.includes(file.mimetype)) {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        } 
        cb(null, true);
    } */
  limits:{
    fileSize: MAX_SIZE
  }
})

const uploadSingle = upload.single('image')

//Upload
imageRoute.post("/uploadFile", upload.single("image"), (req, res) => {
  try{

    dbcofig.execute("INSERT INTO images (date, ContractId, userId, latlong, image) VALUES (?, ?, ?, ?, ?)",
      [
        date = req.body.date,
        ContractId = req.body.ContractId,
        userId = req.body.userId,
        latlong = req.body.latlong,
        image = req.file.filename,
      ],(err, results, fields) => {
        res.json({
          status: "ok",
          message: "File uploaded successfully",
        });
      }
    )
  }catch (err) {
    return res.json({ status: "error", message: err });
  }
});

imageRoute.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.json({status:"error",message: "Only image are allowed .png, .jpg และ .jpeg !" })
    return;
  }
  if(err.code === "LIMIT_FILE_SIZE"){
    res.json({status:"error",message: `Too large. Max size is ${MAX_SIZE/1000}KB` })
    return;
  }
})

/* //Upload
imageRoute.post("/uploadFile", (req, res) => {
    try{
        uploadSingle(req, res, (err) => {
            if(err) { return res.json({status:"error",message:"อนุญาตเฉพาะรูปแบบ .png, .jpg และ .jpeg!"}); }
            (date = req.body.date),
            (ContractId = req.body.ContractId),
            (userId = req.body.userId),
            (latlong = req.body.latlong),
            (image = req.file.filename),
            dbcofig.query("INSERT INTO images (date, ContractId, userId, latlong, image) VALUES (?, ?, ?, ?, ?)",
            [
                date, ContractId, userId, latlong, image,
            ],
            (err, results, fields) => {
                    if (err) {
                        res.json({status:"error" ,message:err.message})
                    }
                    res.json({
                        status: "ok",
                        message: "อัพโหลดไฟล์เสร็จสมบูรณ์",
                    });
                }
            )
        })
    } catch (err) {
      res.json({ status: "error", message: err.message });
    }
}); */


/* get all */
imageRoute.get("/uploads", async (req, res, next) => {
  try {
    dbcofig.execute("SELECT * FROM images", (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
      }
      res.json(results);
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", message: err });
  }
});

/* get all image by id contractId */
imageRoute.get("/Get-imagesId/:id", async (req, res, next) => {
  try {
    dbcofig.execute(
      "SELECT * FROM (images INNER JOIN users ON images.userId = users.userId) WHERE ContractId=?",[req.params.id],(err, data) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
      }
      res.json(data);
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", message: err });
  }
});

/* get by id */
imageRoute.get('/upload/:id', async (req, res, next) => {
  try {
    dbcofig.execute('SELECT * FROM `images` WHERE `imgId`=?', [req.params.id], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
      }
      res.json(data);
    });

  } catch (err) {
    console.log(err);
    return res.json({ status: "error", message: err });
  }
});

/* get inner join by id */
imageRoute.get('/join-image/:id', async (req, res, next) => {
  try {
    dbcofig.query('SELECT * FROM ((images INNER JOIN users ON images.userId = users.userId)INNER JOIN contract ON images.ContractId = contract.ContractId) WHERE `imgId`=?', [req.params.id], (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
      }
      res.json(results);
    });

  } catch (err) {
    console.log(err);
    return res.json({ status: "error", message: err });
  }
});

/* get inner join */
imageRoute.get('/join-images', async (req, res, next) => {
  try {
    dbcofig.query("SELECT * FROM ((images INNER JOIN users ON images.userId = users.userId)INNER JOIN contract ON images.ContractId = contract.ContractId)", (err, results) => {
      if (err) {
        return res.json({ status: "error", message: err });
      }
      res.json(results);
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: "error", message: err });
  }
});

imageRoute.delete('/delete-poto/:id', async (req, res, next) => {
    try{
        dbcofig.execute("DELETE FROM `images` WHERE imgId=?",[req.params.id],(err, results) => {
            if(err) {
                return res.json({ status: "error", message: "Delete images incorrect" });
            }
            res.json({status:"ok",message:"Delete image successfully"});
        })
    }catch(err){
        return res.json({status:"error" ,message:"Delete images incorrect"})
    }
})

module.exports = imageRoute;
