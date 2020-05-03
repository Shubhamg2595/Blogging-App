const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {

    let currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(posts => {
            res.status(200)
                .json({
                    message: 'postss Fetched',
                    posts: posts,
                    totalItems: totalItems
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


exports.getPostById = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new error('Sorry. This post no longer exists.')
                error.statusCode = 422;
                throw error;
            }
            res.status(200)
                .json({
                    message: 'post Fetched',
                    post: post
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.createPost = (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Unexpectead input received');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No Image provided');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
    })
    let userData;

    post.save()
        .then(result => {
            return User.findById(req.userId);
        }).then(user => {
            userData = user;
            user.posts.push(post);
            return user.save();

        }).then(result => {
            res.status(201).json({
                message: "post created successfully",
                post: post,
                userData: { _id: userData._id, name: userData.name }
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.updatePostById = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Unexpectead input received');
        error.statusCode = 422;
        throw error;
    }

    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
        const error = new Error('No Image provided');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new error('Sorry. This post no longer exists.')
                error.statusCode = 422;
                throw error;
            }

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized.')
                error.statusCode = 403;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated',
                post: result,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.deletePostById = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new error('Sorry. This post no longer exists.')
                error.statusCode = 422;
                throw error;
            }

            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not Authorized.')
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId)
        }).then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: "Post deleted successfully"
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });


}



exports.getStatus = (req, res, next) => {
    const userId = req.userId;

    User.findById({ _id: userId })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'User status sent',
                status: user.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.updateStatus = (req, res, next) => {
    const userId = req.userId;
    const newStatus = req.body.status;
    console.log('newStatus',req.body)

    User.findById({ _id: userId })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            // console.log('before',user);
            user.status = newStatus;
            
            // console.log('after',user);
            return user.save();
        }).then(result => {
            res.status(200).json({
                message: 'User status updated',
                status: result.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


let clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}