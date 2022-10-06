import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не удалось создать статью",
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не удалось найти статьи",
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1}
            },
            {
                returnDocument: "after"
            },
            (err, doc) => {
                if( err ) {
                    console.log(error);
                    return res.status(500).json({
                        message: "Не удалось вернуть статью",
                    })
                }
                if ( !doc ) {
                    return res.status(404).json({
                        message: "Статья не найдена "
                    })
                }
                res.json(doc);
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не удалось найти статью",
        });
    }
}

export const remove = (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({
                        message: "Не удалось удалить статью"
                    })
                } 
                if(!doc) {
                    res.status(404).json({
                        message: "Статья не найдена"
                    })
                } else {
                    res.json({
                        success: true
                    })
                }
            }
        )
    } catch (error) {
        
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );
        res.json({
            success: true
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось обновить статью"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts
        .map(post => post.tags)
        .flat()
        .filter((value, index, arr) => arr.indexOf(value) === index)
        .slice(0, 5);

        res.json(tags)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не удалось найти статьи",
        });
    }
}