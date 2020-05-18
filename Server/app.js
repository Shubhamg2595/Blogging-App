const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid-v4')

const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const auth = require('./middleware/auth')

// for multer : file upload
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4())
    }
})

const fileFilter = (rqe, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


app.use(bodyParser.json());
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(auth);


app.put('/post-image', (req, res, next) => {
    if(!req.isAuth){
        throw new Error('Not authenticated!');
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No File Provided' });
    }
    if(req.body.oldPath){
        clearImage(req.body.oldPath);
    }
    return res.status(201).json({message: 'file stored',filePath: req.file.path})



})



// app.use('/feed', feedRoutes)
// app.use('/auth', authRoutes)





app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'Error occured';
        const code = err.originalError.code || 500;
        return {
            message: message,
            static: code,
            data: data,
        }
    }
}))



app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
})


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ixl3c.mongodb.net/${process.env.MONDO_DB}?retryWrites=true&w=majority`)
    .then(connected => {
        console.log('connected to DB.')
        app.listen(3000);
    })
    .catch(err => {
        console.log('Error in DB connection', err);
    })




const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}