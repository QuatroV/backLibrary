const Router = require("express");
const router = new Router();
const BookController = require("../controllers/bookController");

router.post("/");
router.get("/");
router.get("/:id");
router.get(
  "/getBooksTitlesAndDescriptions",
  BookController.getAllBooksNamesAuthorsAndDescriptions
);

module.exports = router;
