import { put } from 'redux-saga/effects'
import { loginSuccess } from '../Actions/actions';

export function* handleLoginSaga(action) {
    console.log('Login saga initiated',action);
    yield put(loginSuccess('helll yesssss'));
}
