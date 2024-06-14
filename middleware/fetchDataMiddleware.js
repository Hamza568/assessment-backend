const axios = require("axios");
const User = require("../models/userModel");

const fetchDataMiddleware = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const fetchedUsers = response.data;

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const usersToInsert = fetchedUsers.map(({ id, name, email }) => ({ id, name, email }));
      await User.insertMany(usersToInsert);
    }
  } catch (error) {
    console.error("Error fetching or inserting users data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  next();
};

module.exports = fetchDataMiddleware;
