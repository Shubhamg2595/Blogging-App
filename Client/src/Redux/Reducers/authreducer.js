import { Constants } from '../Constants/constants';


export const initialState = {
    loading: false,
    loginData: null,
    error: null,
    testRes: null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case Constants.LOGIN:
            debugger
            console.log('login action');

            return {
                ...state,
                loading: true,
            }

        case Constants.LOGIN_SUCCESS:
            console.log('login LOGIN_SUCCESS');

            return {
                ...state,
                // loading: false,
                testRes: action.payload
            }
          
        case Constants.LOGIN_ERROR:
            console.log('inside LOGIN_ERROR', action);
            return {
                ...state,
                error: action.error,
            }
        default:
            return state;

    }
    return state
} 
