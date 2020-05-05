import { Constants } from '../Constants/constants'



export const login = (authData) => (
    {
        type: Constants.LOGIN,
        payload: authData
    }
);


export const loginSuccess = (successRes) => (
    {
        type: Constants.LOGIN_SUCCESS,
        payload: successRes
    }
);

export const loginError = (error) => (
    {
        type: Constants.LOGIN_ERROR,
        payload: error
    }
);