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

export const fetchStatus = () => (
    {
        type: Constants.FETCH_STATUS,
    }
);

export const fetchStatusSuccess = (successres) => (
    {
        type: Constants.FETCH_STATUS_SUCCESS,
        payload: successres
    }
);

export const fetchStatusError = (error) => (
    {
        type: Constants.FETCH_STATUS_ERROR,
        payload: error,
    }
);