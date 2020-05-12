import { combineReducers } from 'redux';


import { authReducer } from './authreducer';
import { feedReducer } from './feedReducer';
// import loadReducer from './loadingReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    feed: feedReducer,
    // isLoading: loadReducer,
})

export default rootReducer;