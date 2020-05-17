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
        const imageUrl = postInput.imageUrl;

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



    }
}