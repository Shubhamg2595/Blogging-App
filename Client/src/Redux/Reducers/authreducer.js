import { Constants } from '../Constants/constants';

export const initialState = {
    loading: false,
    loginData: null,
    error: null,
    testRes: null,
    userId: null,
    isAuth: false,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case Constants.LOGIN:
            console.log('login action');

            return {
                ...state,
                loading: true,
            }

        case Constants.LOGIN_SUCCESS:
            console.log('login LOGIN_SUCCESS');

            return {
                ...state,
                loading: false,
                isAuth: true,
                userId: action.payload.userId
            }
          
        case Constants.LOGIN_ERROR:
            console.log('inside LOGIN_ERROR', action);
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state;

    }
} 
