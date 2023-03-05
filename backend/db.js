const mongoose = require("mongoose");

const mongoURI = process.env.DATABASE_URL;

const mongoDB = async () => {
  await mongoose.connect(
    mongoURI,
    { useNewUrlParser: true },
    async (err, result) => {
      if (err) console.log("ERROR", err);
      else console.log("Connection Successful");
      const fetched_data = await mongoose.connection.db.collection(
        "food_items"
      );
      // Read Data
      fetched_data.find({}).toArray(async function (err, data) {
        const foodCategory = await mongoose.connection.db.collection(
          "foodCategory"
        );
        foodCategory.find({}).toArray(function (err, catData) {
          if (err) console.log("ERROR", err);
          else global.food_items = data;
          global.foodCategory = catData;
        });
        // if (err) console.log("ERROR1", err);
        // else global.food_items = data;
        // console.log("data", data);
      }); // {} signifies all database
    }
  );
};

module.exports = mongoDB;
