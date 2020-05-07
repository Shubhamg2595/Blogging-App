import { Constants } from '../Constants/constants';

export const initialState = {
    status: '',
    posts: [],
    error: null,
}

export const feedReducer = (state = initialState, action) => {
    switch (action.type) {

        case Constants.FETCH_STATUS:
            console.log('FETCH_STATUS ACTION');
            return state;
        case Constants.FETCH_STATUS_SUCCESS:
            console.log('FETCH_STATUS_SUCCESS ACTION');
            return {
                ...state,
                status: action.payload.status
            }
        case Constants.FETCH_STATUS_ERROR:
            console.log('FETCH_STATUS_ERROR ACTION');
            return {
                ...state,
                error: action.payload.error

            }

        default:
            return state;

    }
} 
