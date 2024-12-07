const { handleMongoQueryError } = require("../db");
const User = require("../models/users_model");
const token = require("../utilities/token");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.warn("Error fetching users:", err);
    return handleMongoQueryError(res, err);
  }
};

const getUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.warn("Error fetching user:", err);
    return handleMongoQueryError(res, err);
  }
};

const registerNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      password,
    });

    const savedUser = await user.save();
    return res.json(savedUser);
  } catch (err) {
    console.warn("Error registering user:", err);
    return handleMongoQueryError(res, err);
  }
};

const updateUserById = async (req, res) => {
  const { user_id } = req.params;
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { username, email, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.warn("Error updating user:", err);
    return handleMongoQueryError(res, err);
  }
};

const deleteUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(user_id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(deletedUser);
  } catch (err) {
    console.warn("Error deleting user:", err);
    return handleMongoQueryError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    const isMatchedpassword = await bcrypt.compare(
      password,
      existingUser?.password
    );
    if (!isMatchedpassword) {
      return res
        .status(400)
        .json({ error: "wrong credentials. Please try again." });
    }
    const { accessToken, refreshToken } = await token.generateTokens(
      existingUser
    );
    token.updateCookies(accessToken, refreshToken, res);
    return res.status(200).json({ message: "logged in successfully." });
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging in.", err });
  }
};

const logout = async (req, res) => {
  try {
    token.clearCookies(res);
    return res.status(200).json({ message: "logged out successfully." });
  } catch {
    console.warn("Error while logging out:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging out.", err });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerNewUser,
  updateUserById,
  deleteUserById,
  login,
  logout,
};
