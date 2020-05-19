const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const validator = require('validator').default;
// const validator = validatorModule.default;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');


module.exports = {
    createUser: async function ({ userInput }, req) {

        const errors = [];

        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Invalid Email' })
        }

        if (validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password length must be greater than 5' })
        }
        if (errors.length) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        // userInput destructured from  args Object
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exist already');
            throw error
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 12);

        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword
        });

        const createdUser = await user.save();

        return {
            ...createdUser._doc,
            _id: createdUser._id.toString(),
        }


    },

    login: async function ({ loginInput }, req) {



        const user = await User.findOne({ email: loginInput.email });

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 401;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(loginInput.password, user.password)

        if (!isValidPassword) {
            const error = new Error('Password not matched');
            error.statusCode = 422;
            throw error;
        }

        const token = jwt.sign(
            {
                email: loginInput.email,
                userId: user._id.toString(),
            },
            'mysupersecretjwtkey',
            {
                expiresIn: '1h'
            });

        return {
            token: token,
            userId: user._id.toString(),
        }



    },

    createPost: async function ({ postInput }, req) {

        if (!req.isAuth) {
            const error = new Error('User Not Authenticated');
            error.code = 401;
            throw error;
        }

        let creatorData = await User.findById(req.userId);
        if (!creatorData) {
            const error = new Error('User Not Found');
            error.code = 401;
            throw error;
        }



        let errors = [];

        const title = postInput.title;
        const content = postInput.content;
        console.log('imageUrl', postInput.imageUrl)
        const imageUrl = postInput.imageUrl.replace("//", "/");

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: 'title must have more than 5 characters' })
        }

        if (validator.isEmpty(title) || !validator.isLength(content, { min: 5 })) {
            errors.push({ message: 'content must have more than 5 characters' })
        }
        if (errors.length) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: creatorData,
        });

        let createdPost = await post.save();

        creatorData.posts.push(createdPost);
        await creatorData.save();

        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
        }



    },

    updatePost: async function ({ id, postInput }, req) {
        if (!req.isAuth) {
            const error = new Error('User Not Authenticated');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(id).populate('creator');
        if (!post) {
            const error = new Error('No Post Found');
            error.code = 404;
            throw error;
        }

        if (post.creator._id.toString() !== req.userId.toString()) {
            const error = new Error('Unauthenticated User');
            error.code = 403;
            throw error;
        }


        let errors = [];

        const title = postInput.title;
        const content = postInput.content;
        console.log('imageUrl', postInput.imageUrl)

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: 'title must have more than 5 characters' })
        }

        if (validator.isEmpty(title) || !validator.isLength(content, { min: 5 })) {
            errors.push({ message: 'content must have more than 5 characters' })
        }
        if (errors.length) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }


        post.title = postInput.title;
        post.content = postInput.content;
        if (postInput.imageUrl !== undefined) {
            post.imageUrl = postInput.imageUrl.replace("//", "/");
        }

        const updatedPost = await post.save();

        return {
            ...updatedPost._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toString(),
            updatedAt: post.updatedAt.toString(),
        }


    },

    deletePost: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('User Not Authenticated');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('Sorry. This post no longer exists.')
            error.statusCode = 422;
            throw error;
        }
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not Authorized.')
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(id)
        const creatorOfDeletedPost = await User.findById(req.userId);
        console.log('creatorOfDeletedPost',creatorOfDeletedPost.posts)
        
        creatorOfDeletedPost.posts.pull(id);
        await creatorOfDeletedPost.save();
        return true

    },

    posts: async function ({ page }, req) {

        if (!req.isAuth) {
            const error = new Error('User Not Authenticated');
            error.code = 401;
            throw error;
        }

        if (!page) {
            page = 1;
        }
        const perPage = 2;
        // let currentPage = postInput.page || 1;
        // const perPage = 2;

        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        return {
            posts: posts.map(post => {
                return {
                    ...post._doc,
                    _id: post._id.toString(),
                    createdAt: post.createdAt.toISOString(),
                    updatedAt: post.updatedAt.toISOString(),
                }
            }),
            totalPosts: totalPosts
        }
    },

    post: async function ({ id }, req) {
        // if (!req.isAuth) {
        //     const error = new Error('User Not Authenticated');
        //     error.code = 401;
        //     throw error;
        // }

        const post = await Post.findById(id).populate('creator');

        if (!post) {
            const error = new Error('No Post Found');
            error.code = 404;
            throw error;
        }

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toString(),
            updatedAt: post.updatedAt.toString(),
        }

    }

}



let clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}