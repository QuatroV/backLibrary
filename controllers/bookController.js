const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const { Book, ShelfItem } = require("../models/models");

class BookController {
  getBook = async (req, res, next) => {
    const { bookId } = req.query;
    const [bookInfo, metadata] = await sequelize.query(
      `SELECT id, title, author, convert_from(public.books.description, 'utf8') as description, convert_from(public.books.annotation, 'utf8') as annotation FROM public.books WHERE id = ${bookId}`
    );
    return res.json({ bookInfo });
  };
  updateBookInfo = async (req, res, next) => {
    const { title, author, description, annotation, bookId } = req.body;
    const updatedBook = await Book.update(
      { title, author, description, annotation },
      { where: { id: bookId } }
    );
    return res.json({ updatedBook });
  };
  getAllBooksNamesAuthorsAndDescriptions = async (req, res) => {
    const [books, metadata] = await sequelize.query(
      "SELECT id, title, author, convert_from(public.books.description, 'utf8') as description FROM public.books ORDER BY id"
    );
    return res.json({ books });
  };
  getBookText = async (req, res) => {
    const { bookId } = req.query;
    const [text, metadata] = await sequelize.query(
      `SELECT convert_from(public.books.text, 'utf8') as text FROM public.books WHERE id = ${bookId}`
    );
    return res.json({ text });
  };
  addNewBook = async (req, res, next) => {
    const { title, authorName: author, description, annotation } = req.body;
    const { textFile } = req.files;
    try {
      const newBook = await Book.create({
        title,
        author,
        description,
        annotation,
        text: textFile.data.toString("utf8"),
      });
      return res.json({ newBook });
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest("Проблема при прочтении файла с текстом книги"));
    }
  };
  deleteBook = async (req, res, next) => {
    const { bookId } = req.body;
    const bookToDelete = await Book.findOne({ where: { id: bookId } });
    if (!bookToDelete) {
      next(ApiError.badRequest("Книга с таким id не найдена"));
    }
    await bookToDelete.destroy();
    return res.json({ message: `Книга с ID ${bookId} успешно удалена` });
  };
}

module.exports = new BookController();
