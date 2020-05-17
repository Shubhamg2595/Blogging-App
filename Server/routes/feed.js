const express = require('express');

const { body } = require('express-validator/check')

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/auth');


const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.get('/posts/:postId', isAuth, feedController.getPostById);

router.post('/post', isAuth, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 }),

], feedController.createPost);

router.put('/posts/:postId', isAuth, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 }),

], feedController.updatePostById);

router.delete('/posts/:postId', isAuth, feedController.deletePostById);

// get status
router.get('/status', isAuth, feedController.getStatus);

// update status
router.patch('/status', isAuth, [
    body('status')
        .trim()
        .not()
        .isEmpty()
], feedController.updateStatus);

module.exports = router;