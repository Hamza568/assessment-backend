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
      await User.insertMany(
        fetchedUsers.map((user) => ({
          name: user.name,
          email: user.email,
        }))
      );
    }
  } catch (error) {
    console.error("Error fetching or inserting users data:", error);
  }

  next();
};

module.exports = fetchDataMiddleware;
