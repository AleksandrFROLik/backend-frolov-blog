import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('author').exec();// здесь мы образуем связь  между таблицами в
    // mongoDB чтоб можно было вытащить id user.
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'GetAll: Server is fallen'
    })
  }
}

export const getLastTags = async  (req, res ) => {
  try {
    const posts = await PostModel.find().limit(5).exec();// здесь мы образуем связь  между таблицами в
    // mongoDB чтоб можно было вытащить id user.
    const tags = posts.map((post) => post.tags).flat().slice(0, 5);

    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'GetLastTags:Server is fallen'
    })
  }
}

export const getOne = async (req, res) =>  {
  try {
    const postId = req.params.id
    await PostModel.findOneAndUpdate({
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
            message: 'GetOne: Failed to retrieve article'
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'GetOne: Article not found'
          })
        }

        res.json(doc)

      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'GetOne: Server is fallen'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
     await PostModel.findOneAndRemove({
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          res.status(500).json({
            message: 'Remove: Article not deleted'
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Remove: Article not found'
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
      message: 'Remove: Server is fallen'
    })
  }
}

export const create = async (req, res) => {

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
      message: 'Create: The article is not create'
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
      message: 'Update: Do not update the article'
    })
  }
}
