const bcrypt = require('bcryptjs');
const validator = require('validator').default;
// const validator = validatorModule.default;

const User = require('../models/user');



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


    }
}