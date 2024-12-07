const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
};

const handleMongoQueryError = (res, err) => {
  const duplicateKeyErrorCode = 11000;

  if (err?.code === duplicateKeyErrorCode) {
    return res.status(400).json({
      error: `Values of fields ${Object.keys(
        err.keyPattern
      ).toString()} already exist`,
      fields: Object.keys(err.keyPattern),
    });
  } else if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = { connectDB, handleMongoQueryError };
