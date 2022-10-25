const router = require("express").Router();
const userRoutes = require("./user-Routes");
const thoughtRoutes = require("./thought-Routes");

router.use("/user", userRoutes);
router.use("/thought", thoughtRoutes);

module.exports = router;
