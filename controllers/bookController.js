const sequelize = require("../db");
const { Book, ShelfItem } = require("../models/models");

class BookController {
  getAllBooksNamesAuthorsAndDescriptions = async (req, res) => {
    const [books, metadata] = await sequelize.query(
      "SELECT id, title, author, convert_from(public.books.description, 'utf8') as description FROM public.books"
    );
    return res.json({ books });
  };
  getBookText = async (req, res) => {
    const [text, metadata] = await sequelize.query(
      "SELECT convert_from(public.books.text, 'utf8') as text FROM public.books"
    );
    return res.json(text);
  };
}

module.exports = new BookController();
