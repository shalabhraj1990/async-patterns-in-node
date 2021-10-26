const { json } = require("body-parser");
const express = require("express");
const fs = require("fs");
const fsPromise = require("fs").promises;
const datafile = "server/data/clothing.json";
const router = express.Router();

/* GET all clothing */
// router.route("/").get(function (req, res) {
//   getClothingData()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => res.status(500).send(err))
//     .finally(() => console.log("All Done!!"));

//   console.log("Doing more work");
// });
router.route("/").get(async function (req, res) {
  try {
    let data = await getClothingData();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});
async function getClothingData() {
  let rawData = await fsPromise.readFile(datafile, "utf8");
  return JSON.parse(rawData);
  // return new Promise((resolve, reject) => {
  //   fs.readFile(datafile, "utf8", (err, data) => {
  //     if (err) reject(err);
  //     else resolve(JSON.parse(data));
  //   });
  // });
}
module.exports = router;
