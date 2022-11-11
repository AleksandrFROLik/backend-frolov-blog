  import jsonwebtoken from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); //  здесь мы убираем слово Bearer и
  // остается только сам token
  if (token) {
    try {
      const decoded = jsonwebtoken.verify(token, 'secret123')// здесь декодируем token  по нишему ключу 'secret123'
      req.userId = decoded._id;
      next();// обязательно добовляем эту строчку чтоб отдать команду на продолжение кода в index.js

    } catch (err) {
      return res.status(403).json({
        message: 'No access',
      })
    }
  } else {
    res.status(403).json({
      message: 'No access',
    })
  }
}