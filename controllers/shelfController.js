const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const { Shelf, ShelfItem, User, Book } = require("../models/models");

const getUserShelfByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  const userShelf = await Shelf.findOne({ where: { userId: user.id } });
  return userShelf;
};

const getUserBooksByEmail = async (email, next) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    next(ApiError.badRequest("Пользователь с таким email не найден"));
  }
  const userShelf = await Shelf.findOne({ where: { userId: user.id } });
  const userShelfItems = await ShelfItem.findAll({
    where: { shelfId: userShelf.id },
  });
  const userShelfItemsIds = userShelfItems
    .map((userShelfItem) => userShelfItem.bookId)
    .filter(Boolean);
  const [userBooks, metadata] = await sequelize.query(
    `SELECT id, title, author, convert_from(public.books.description, 'utf8') as description FROM public.books WHERE id = ANY(ARRAY[${userShelfItemsIds}]) `
  );
  return userBooks;
};

class ShelfController {
  addBookToShelf = async (req, res, next) => {
    const { email, bookId } = req.body;
    const userShelf = await getUserShelfByEmail(email);
    const [shelfItem] = await ShelfItem.findOrCreate({
      where: { shelfId: userShelf.id, bookId },
    });
    return res.json({ shelfItem });
  };
  getShelfBooks = async (req, res, next) => {
    const { email } = req.body;
    const userBooks = await getUserBooksByEmail(email, next);
    return res.json(userBooks);
  };
  addBookmarkToShelfItem = async (req, res, next) => {
    const { progress, bookId, email } = req.body;
    const user = await User.findOne({ where: { email } });
    const shelf = await Shelf.findOne({ where: { userId: user.id } });
    const shelfItemWithBookmark = await ShelfItem.update(
      { progress },
      { where: { bookId, shelfId: shelf.id } }
    );
    return res.json(shelfItemWithBookmark);
  };
  getBookmark = async (req, res, next) => {
    const { bookId, email } = req.query;
    const shelf = await getUserShelfByEmail(email);
    const shelfItem = await ShelfItem.findOne({
      where: { shelfId: shelf.id, bookId },
    });
    return res.json(shelfItem.progress);
  };
}

module.exports = new ShelfController();
