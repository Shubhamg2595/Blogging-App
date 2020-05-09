import { Constants } from '../Constants/constants';

export const initialState = {
    loading: false,
    status: '',
    posts: [],
    totalPosts: 0,
    error: null,
    currentPost: null,
}

let newPost;
let updatedPosts;


export const feedReducer = (state = initialState, action) => {
    switch (action.type) {

        case Constants.FETCH_STATUS:
            console.log('FETCH_STATUS REDUCER');
            return {
                ...state,
                loading: true,
            }
        case Constants.FETCH_STATUS_SUCCESS:
            console.log('FETCH_STATUS_SUCCESS REDUCER');
            return {
                ...state,
                status: action.payload.status,
                loading: false,
            }
        case Constants.FETCH_STATUS_ERROR:
            console.log('FETCH_STATUS_ERROR REDUCER');
            return {
                ...state,
                error: action.payload.error
            }

        case Constants.FETCH_POSTS:
            console.log('FETCH_POSTS REDUCER');
            return {
                ...state,
                loading: true,
            }
        case Constants.FETCH_POSTS_SUCCESS:
            console.log('FETCH_POSTS_SUCCESS REDUCER');

            let modifiedPosts = postReducer(action.payload.posts)

            return {
                ...state,
                // posts: [...state.posts, ...modifiedPosts],
                posts: [...modifiedPosts],
                totalPosts: action.payload.totalItems,
                loading: false,
            }
        case Constants.FETCH_POSTS_ERROR:
            console.log('FETCH_STATUS_ERROR REDUCER');
            return {
                ...state,
                error: action.payload.error
            }


        case Constants.ADD_NEW_POST:
            console.log('ADD_NEW_POST REDUCER');
            return {
                ...state,
                loading: true,
            }
        case Constants.ADD_NEW_POST_SUCCESS:
            console.log('ADD_NEW_POST_SUCCESS REDUCER');
            newPost = action.payload.post;
            updatedPosts = [newPost, ...state.posts];
            updatedPosts = postReducer(updatedPosts);

            return {
                ...state,
                posts: updatedPosts,
                totalPosts: state.totalPosts + 1,
                loading: false,
            }
        case Constants.ADD_NEW_POST_ERROR:
            console.log('ADD_NEW_POST_ERROR REDUCER');
            return {
                ...state,
                error: action.payload.error
            }


        case Constants.FETCH_SINGLE_POST:
            console.log('FETCH_SINGLE_POST REDUCER');
            return {
                ...state,
                loading: true,
            }
        case Constants.FETCH_SINGLE_POST_SUCCESS:
            console.log('FETCH_SINGLE_POST_SUCCESS REDUCER');
            

            return {
                ...state,
                currentPost: action.payload.post,
                loading: false,
            }
        case Constants.FETCH_SINGLE_POST_ERROR:
            console.log('FETCH_SINGLE_POST_ERROR REDUCER');
            return {
                ...state,
                error: action.payload.error
            }

        default:
            return state;

    }
}



function postReducer(posts) {
    try {
        let reducedPosts = [];

        // key-value pair code
        //     let test = {};
        // action.payload.posts.map(post =>  {  test[post._id]= {...post} } )
        // console.log(test)

        if (posts.length) {
            reducedPosts = posts.map(post => {
                return {
                    ...post,
                    imagePath: post.imageUrl
                }
            })
        }
        return reducedPosts;
    }
    catch (err) {
        console.error('Error in Post reducer', err);
    }
}