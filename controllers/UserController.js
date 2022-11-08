import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);// алгоритм шифрования паролей
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();// этой строкой даем команду на сохранение user в mongoDB
    const token = jsonwebtoken.sign({
        _id: user._id,
      },
      'secret123',// второй параметр говорит как шифровать token
      {
        expiresIn: '30d'//это третий параметр говорит что token будет валиден 30 дней
      })

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Registration is fallen'
    })
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })// команда для  mongoDB найти user  по email

    if ( !user ) {
      return res.status(404).join({
        message: 'Login or password is not correct'
      })// Здесь описываем случай если он не найдется чтоб отправить сообщение пользователю
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)// здесь сравниваем пароли
// который есть в запросе и тот который храниться в mongoDB

    if ( !isValidPass ) {
      return res.status(400).json({
        message: 'Login or password is not correct'
      })// Здесь описываем случай если пароль не верный чтоб отправить сообщение пользователю
    }

    const token = jsonwebtoken.sign({
        _id: user._id,
      },
      'secret123',// второй параметр говорит как шифровать token
      {
        expiresIn: '30d'//это третий параметр говорит что token будет валиден 3 дней
      })

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Login is fallen'
    })
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)// здесь мы говорим что UserModel должен при помощи метода
    // findById найти пользоваеля по переданному id. req.userId
    if ( !user ) {
      return res.status(404).json({
        message: 'User is not found'
      })
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({ userData })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'No access'
    })
  }
};