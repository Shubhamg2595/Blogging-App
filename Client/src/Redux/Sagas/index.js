import { takeEvery, put } from 'redux-saga/effects'
import { Constants } from '../Constants/constants';
import { loginSuccess } from '../Actions/actions';

function* handleLoginSaga(action) {
    console.log('Login saga initiated',action);
    yield put(loginSuccess('helll yesssss'));
}


// watcher
function* rootSaga() {
    yield takeEvery(Constants.LOGIN, handleLoginSaga)
}




export default rootSaga;