const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Shelf = sequelize.define("shelf", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const ShelfItem = sequelize.define("shelf_item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Book = sequelize.define("book", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  description: { type: DataTypes.BLOB },
  annotation: { type: DataTypes.BLOB },
  text: { type: DataTypes.BLOB },
});

User.hasOne(Shelf);
Shelf.belongsTo(User);

Shelf.hasMany(ShelfItem);
ShelfItem.belongsTo(Shelf);

Book.hasMany(ShelfItem);
ShelfItem.belongsTo(Book);

module.exports = { User, Shelf, ShelfItem, Book };
