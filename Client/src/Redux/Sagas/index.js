import { takeEvery } from 'redux-saga/effects'
import { Constants } from '../Constants/constants';
import { handleLoginSaga } from './authSaga';
import { fetchUserStatusSaga, fetchAllPostsSaga, addNewPostSaga, fetchPostByIdSaga, updatePostByIdSaga, deletePostByIdSaga } from './feedSaga';


// watcher Saga
function* rootSaga() {
    yield takeEvery(Constants.LOGIN, handleLoginSaga)
    yield takeEvery(Constants.FETCH_STATUS, fetchUserStatusSaga)
    yield takeEvery(Constants.FETCH_POSTS, fetchAllPostsSaga)
    yield takeEvery(Constants.ADD_NEW_POST, addNewPostSaga)
    yield takeEvery(Constants.FETCH_SINGLE_POST, fetchPostByIdSaga)
    yield takeEvery(Constants.EDIT_POST, updatePostByIdSaga)
    yield takeEvery(Constants.DELETE_POST, deletePostByIdSaga)
}

export default rootSaga;