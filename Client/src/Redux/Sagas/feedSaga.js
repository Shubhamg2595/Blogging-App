import { put } from 'redux-saga/effects'
import { fetchStatusSuccess, fetchStatusError } from '../Actions/actions';
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
