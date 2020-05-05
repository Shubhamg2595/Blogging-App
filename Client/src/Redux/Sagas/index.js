import { takeEvery } from 'redux-saga/effects'
import { Constants } from '../Constants/constants';
import { handleLoginSaga } from './authSaga';


// watcher Saga
function* rootSaga() {
    yield takeEvery(Constants.LOGIN, handleLoginSaga)
}

export default rootSaga;