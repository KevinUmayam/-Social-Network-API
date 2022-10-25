const router = require("express").Router();

const {
  createUsers,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require("../../controllers/usercontroller");

router.route("/").get(getAllUsers).post(createUsers);

router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;
