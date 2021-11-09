const Router = require("express");
const router = new Router();
const shelfController = require("../controllers/shelfController");

router.post("/addBookToShelf", shelfController.addBookToShelf);
router.post("/getShelfBooks", shelfController.getShelfBooks);

module.exports = router;
