const Router = require("express");
const bookController = require("../controllers/bookController");
const router = new Router();
const shelfController = require("../controllers/shelfController");

router.post("/addBookToShelf", shelfController.addBookToShelf);
router.post("/getShelfBooks", shelfController.getShelfBooks);
router.post("/addBookmarkToShelfItem", shelfController.addBookmarkToShelfItem);
router.get("/getBookmark", shelfController.getBookmark);

module.exports = router;
