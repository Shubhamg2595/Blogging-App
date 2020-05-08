import { takeEvery } from 'redux-saga/effects'
import { Constants } from '../Constants/constants';
import { handleLoginSaga } from './authSaga';
import { fetchUserStatusSaga, fetchAllPostsSaga, addNewPostSaga } from './feedSaga';


// watcher Saga
function* rootSaga() {
    yield takeEvery(Constants.LOGIN, handleLoginSaga)
    yield takeEvery(Constants.FETCH_STATUS, fetchUserStatusSaga)
    yield takeEvery(Constants.FETCH_POSTS, fetchAllPostsSaga)
    yield takeEvery(Constants.ADD_NEW_POST, addNewPostSaga)
}

export default rootSaga;