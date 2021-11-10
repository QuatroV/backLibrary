const Router = require("express");
const bookController = require("../controllers/bookController");
const router = new Router();
const BookController = require("../controllers/bookController");

router.get("/getBookText", bookController.getBookText);
router.get(
  "/getBooksTitlesAndDescriptions",
  BookController.getAllBooksNamesAuthorsAndDescriptions
);
router.post("/addNewBook", bookController.addNewBook);
router.delete("/deleteBook", bookController.deleteBook);
router.get("/getBook", bookController.getBook);
router.patch("/updateBookInfo", bookController.updateBookInfo);

module.exports = router;
