import express from 'express';
import mongoose from 'mongoose';
import { loginValidation, postCreateValidation, registerValidation } from "./validations.js";
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import multer from 'multer';
import cors from 'cors';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.cmyote5.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error:', err))

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },// это функция объесняет куда необходимо сохранять картинки.
  filename: (_, file, callback) => {
    callback(null, file.originalname)
  }
});// это хранилище где м будем сохранять картинки

const upload = multer({ storage });

app.use(express.json())//чтоб  сервер понимал форат json, если убрать эту строчку то в терминале или в ответе будет
// undefined

app.use(cors()) //разрешение на переход из одного сервера к другому.

app.use('/uploads', express.static('uploads')); //проверка которая делает express чтоб понять есть ли такая картинка
// в папке. Это необходимо чтоб картинка появилась а не выдала просто све название на frontend.

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`
    });
  }
);

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('posts/:id', checkAuth, PostController.remove);
app.patch('posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4444, (err) => {
  if ( err ) {
    return console.log(err)
  }
  console.log('Server OK')
})
