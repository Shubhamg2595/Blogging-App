import { put } from 'redux-saga/effects'
import { loginSuccess, loginError } from '../Actions/actions';
import axios from '../../util/axios'

export function* handleLoginSaga(action) {
    console.log('Login saga initiated', action);
    try {
        const { email, password } = action.payload;

        if (email === '' || password === '') {
            const error = new Error();
            if (email === '' && password === '') {
                error.message = 'Email ID and password not provided';
            }
            else if (email === '') {
                error.message = 'Email ID Not provided';
            }
            else if (password === '') {
                error.message = 'password Not provided';
            }
            throw error;

        }
        const loginResponse = yield axios.post('auth/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: email,
                password: password,
            }
        })

    }
    catch (err) {
        console.log(err.message)
        yield put(loginError(err.message));
    }

}
