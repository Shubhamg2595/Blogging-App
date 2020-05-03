const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Unexpectead input received');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            });
            return user.save();
        })
        .then(user => {
            res.status(201).json({
                message: "User signUp Successful",
                userId: user._id,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let userData;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            userData = user;

            return bcrypt.compare(password, user.password)
        }).then(doMatch => {
            if (!doMatch) {
                const error = new error('Password not matched');
                error.statusCode = 422;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: userData.email,
                    userId: userData._id.toString()
                },
                'mysupersecretjwtkey',
                {
                    expiresIn: '1h'
                }
            )
            res.status(200).json({
                token: token,
                userId: userData._id.toString(),
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}