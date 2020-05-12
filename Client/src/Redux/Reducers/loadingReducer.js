import { Constants } from '../Constants/constants'

const initialState = {
    loading: false,
}

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case Constants.LOGIN:
            return {
                ...state,
                loading: true,
            }
        // case IMAGES.LOAD_SUCCESS:
        //     return false
        // case IMAGES.LOAD_FAIL:
        //     return false

        default:
            return state
    }
}

export default loadingReducer;