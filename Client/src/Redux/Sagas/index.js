import { takeEvery } from 'redux-saga/effects'
import { Constants } from '../Constants/constants';
import { handleLoginSaga } from './authSaga';
import { fetchUserStatusSaga } from './feedSaga';


// watcher Saga
function* rootSaga() {
    yield takeEvery(Constants.LOGIN, handleLoginSaga)
    yield takeEvery(Constants.FETCH_STATUS, fetchUserStatusSaga)
}

export default rootSaga;