const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const bookRouter = require("./bookRouter");
const shelfRouter = require("./shelfRouter");

router.use("/user", userRouter);
router.use("/book", bookRouter);
router.use("/shelf", shelfRouter);

module.exports = router;
