import { combineReducers } from 'redux';


import { authReducer } from './authreducer';
import loadReducer from './loadingReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    isLoading: loadReducer,
})

export default rootReducer;