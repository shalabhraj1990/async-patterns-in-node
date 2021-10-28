const { json } = require("body-parser");
const express = require("express");
const fs = require("fs");
const fsPromise = require("fs").promises;
const datafile = "server/data/clothing.json";
const router = express.Router();

module.exports = function (monitor) {
  let dataMonitor = monitor;
  dataMonitor.on("dataAdded", (item) => {
    setImmediate(() => console.log(`New data was added: ${item}`));
  });
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
  router
    .route("/")
    .get(async function (req, res) {
      try {
        let data = await getClothingData();
        res.send(data);
      } catch (error) {
        res.status(500).send(error);
      }
    })
    .post(async function (req, res) {
      try {
        let data = await getClothingData();
        let nextID = getNextAvailableId(data);
        let newClothingItem = {
          clothingID: nextID,
          itemName: req.body.itemName,
          price: req.body.price,
        };
        data.push(newClothingItem);
        await saveClothingData(data);
        dataMonitor.emit("dataAdded", newClothingItem.itemName);
        res.status(201).send(newClothingItem);
      } catch (err) {
        res.status(500).send(err);
      }
    });
  function getNextAvailableId(allClothingData) {
    let maxId = 0;
    allClothingData.forEach(function (element, index, array) {
      if (element.clothingID > maxId) {
        maxId = element.clothingID;
      }
      return ++maxId;
    });
  }

  function saveClothingData(data) {
    return fsPromise.writeFile(datafile, JSON.stringify(data));
  }
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
  return router;
};
