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

        const loginQuery = {
            query: `
            query {
                login(
                    loginInput: {
                    email: "${email}",
                    password: "${password}"
            }) {
              userId
              token
            }
          }`
        }


        const headers = {
            'Content-Type': 'application/json'
        }

        const loginResponse = yield axios.post('/graphql',
            loginQuery,
            {
                headers: headers
            });
        if (loginResponse.status === 200) {
            yield put(loginSuccess({
                userId: loginResponse.data.userId
            }))
            localStorage.setItem('token', loginResponse.data.token)
            localStorage.setItem('userId', loginResponse.data.userId)
            // const remainingMilliseconds = 60 * 60 * 1000;
            //     const expiryDate = new Date(
            //         new Date().getTime() + remainingMilliseconds
            //     );
            //     localStorage.setItem('expiryDate', expiryDate.toISOString());
            //     this.setAutoLogout(remainingMilliseconds);
        }


    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data', err.response.data);
            console.error('Error status', err.response.status);
            if (err.response.data && err.response.data.message) {
                yield put(loginError(err.response.data))
            }
        }
    }

}
