import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('author').exec();// здесь мы образуем связь  между таблицами в
    // mongoDB чтоб можно было вытащить id user.
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server is fallen'
    })
  }
}

export const getLastTags = async  (req, res ) => {
  try {
    const posts = await PostModel.find().limit(5).exec();// здесь мы образуем связь  между таблицами в
    // mongoDB чтоб можно было вытащить id user.
    const tags = posts.map((post) => post.tags).flat().slice(0, 5);

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server is fallen'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndUpdate({
        _id: postId,// здесь передаем id  поста для его нахождения
      }, {
        $inc: {viewCount: 1}, //здесь прописываем что счетчик должен увеличиться на оди при запросе этой статьи
      },
      {
        returnDocument: 'after', // после обновления счетчика документ нужно сохранить с новыми данными счетчика
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Failed to retrieve article'
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found'
          })
        }
        res.json(doc)
      }).populate('user')
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server is fallen'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndRemove({
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          res.status(500).json({
            message: 'Article not deleted'
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found'
          })
        }
        res.json({
          success: true,
        })
      },
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server is fallen'
    })
  }
}

export const create = async (req, res) => {

  console.log(req)
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'The article is not create'
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    await PostModel.updateOne({
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        author: req.userId,
        tags: req.body.tags.split(','),
      })
    res.json({
      success: true,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Do not update the article'
    })
  }
}
