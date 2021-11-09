const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Shelf } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  registration = async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      next(ApiError.badRequest("Некорректный email или пароль"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      next(
        ApiError.badRequest("Пользователь с таким email уже зарегистрирован")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const shelf = await Shelf.create({ userId: user.id });
    const token = generateJwt(user.id, email, user.role);
    return res.json({ token });
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      next(ApiError.internal("Пользователь с таким email не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      next(ApiError.internal("Неверный пароль"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  };

  getIsUserAuth = async (req, res, next) => {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  };
}

module.exports = new UserController();
