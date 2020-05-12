import { put } from 'redux-saga/effects'
import { fetchStatusSuccess, fetchStatusError, fetchPostsError, fetchPostsSuccess, addPostSuccess, addPostError, fetchPostByIdSuccess, fetchPostByIdError, updatePostSuccess, updatePostError, deletePostByIdSuccess, deletePostByIdError } from '../Actions/actions';
import axios from '../../util/axios'

export function* fetchUserStatusSaga(action) {
    console.log('fetchUserStatusSaga saga initiated', action);
    try {

        const token = localStorage.getItem('token');
        const loadStatusResponse = yield axios.get('feed/status',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (loadStatusResponse.status === 200) {
            yield put(fetchStatusSuccess({
                status: loadStatusResponse.data.status
            }))
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(fetchStatusError(err.response.data))
            }
        }
    }
}

export function* fetchAllPostsSaga(action) {
    console.log('fetchAllPostsSaga saga initiated', action);
    try {
        const page = action.pageNum;
        const token = localStorage.getItem('token');
        const loadPostsResponse = yield axios.get(`feed/posts?page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (loadPostsResponse.status === 200) {
            yield put(fetchPostsSuccess(loadPostsResponse.data))
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(fetchPostsError(err.response.data))
            }
        }
    }
}

export function* addNewPostSaga(action) {
    console.log('addNewPostSaga saga initiated', action);
    try {
        const token = localStorage.getItem('token');
        const addPostResponse = yield axios.post(`feed/post`,
            action.payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (addPostResponse.status === 201) {
            debugger
            yield put(addPostSuccess(addPostResponse.data))
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(addPostError(err.response.data))
            }
        }
    }
}


export function* fetchPostByIdSaga(action) {
    console.log('fetchPostByIdSaga initiated', action);
    const postId = action.payload;
    try {
        const token = localStorage.getItem('token');
        const fetchPostResponse = yield axios.get(`feed/posts/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (fetchPostResponse.status === 200) {
            yield put(fetchPostByIdSuccess(fetchPostResponse.data))
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(fetchPostByIdError(err.response.data))
            }
        }
    }
}


export function* updatePostByIdSaga(action) {
    console.log('updatePostByIdSaga initiated', action);
    
    try {
        const token = localStorage.getItem('token');
        const fetchPostResponse = yield axios.put(`feed/posts/${action.payload.postId}`,
            action.payload.post,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (fetchPostResponse.status === 200) {
            yield put(updatePostSuccess(fetchPostResponse.data))
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(updatePostError(err.response.data))
            }
        }
    }
}

export function* deletePostByIdSaga(action) {
    console.log('deletePostByIdSaga initiated', action);
    debugger
    try {
        const token = localStorage.getItem('token');
        const fetchPostResponse = yield axios.delete(`feed/posts/${action.payload}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (fetchPostResponse.status === 200) {
            yield put(deletePostByIdSuccess(action.payload))
        }
    }
    catch (err) {
        if (err.response) {
            
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(deletePostByIdError(err.response.data))
            }
        }
    }
}
