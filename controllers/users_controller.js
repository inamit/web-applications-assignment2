const User = require("../models/users_model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.warn("Error fetching users:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the users." });
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
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
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
    res.json(savedUser);
  } catch (err) {
    console.warn("Error registering user:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "username already exsits." });
    } else if (err._message === "User validation failed") {
      res.status(400).json({
        error: "email is not valid. Please enter valid email address",
      });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while registering the user." });
    }
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
    return res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
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
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

module.exports = { getAllUsers, getUserById, registerNewUser, updateUserById, deleteUserById };
