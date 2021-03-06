import { Constants } from '../Constants/constants'



export const login = (authData) => (
    {
        type: Constants.LOGIN,
        payload: authData
    }
);


export const loginSuccess = (successRes) => (
    {
        type: Constants.LOGIN_SUCCESS,
        payload: successRes
    }
);

export const loginError = (error) => (
    {
        type: Constants.LOGIN_ERROR,
        payload: error
    }
);

export const fetchStatus = () => (
    {
        type: Constants.FETCH_STATUS,
    }
);

export const fetchStatusSuccess = (successres) => (
    {
        type: Constants.FETCH_STATUS_SUCCESS,
        payload: successres
    }
);

export const fetchStatusError = (error) => (
    {
        type: Constants.FETCH_STATUS_ERROR,
        payload: error,
    }
);

export const fetchPosts = (pageNum) => (
    {
        type: Constants.FETCH_POSTS,
        pageNum
    }
);

export const fetchPostsSuccess = (successres) => (
    {
        type: Constants.FETCH_POSTS_SUCCESS,
        payload: successres
    }
);

export const fetchPostsError = (error) => (
    {
        type: Constants.FETCH_POSTS_ERROR,
        payload: error,
    }
);



export const addPost = (payload) => (
    {
        type: Constants.ADD_NEW_POST,
        payload
    }
);

export const addPostSuccess = (successres) => (
    {
        type: Constants.ADD_NEW_POST_SUCCESS,
        payload: successres
    }
);

export const addPostError = (error) => (
    {
        type: Constants.ADD_NEW_POST_ERROR,
        payload: error,
    }
);



export const fetchPostById = (postId) => (
    {
        type: Constants.FETCH_SINGLE_POST,
        payload: postId,
    }
);

export const fetchPostByIdSuccess = (successres) => (
    {
        type: Constants.FETCH_SINGLE_POST_SUCCESS,
        payload: successres
    }
);

export const fetchPostByIdError = (error) => (
    {
        type: Constants.FETCH_SINGLE_POST_ERROR,
        payload: error,
    }
);


export const updatePost = (post) => (
    {
        type: Constants.EDIT_POST,
        payload: post,
    }
);

export const updatePostSuccess = (successres) => (
    {
        type: Constants.EDIT_POST_SUCCESS,
        payload: successres
    }
);

export const updatePostError = (error) => (
    {
        type: Constants.EDIT_POST_ERROR,
        payload: error,
    }
);


export const deletePostById = (postId) => (
    {
        type: Constants.DELETE_POST,
        payload: postId,
    }
);

export const deletePostByIdSuccess = (successres) => (
    {
        type: Constants.DELETE_POST_SUCCESS,
        payload: successres
    }
);

export const deletePostByIdError = (error) => (
    {
        type: Constants.DELETE_POST_ERROR,
        payload: error,
    }
);


