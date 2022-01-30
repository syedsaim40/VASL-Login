import ACTIONS from '../actions'

const users =[]

const usersReducer = (state = users, action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_USERS:
            return action.payload
        default:
            return state
    }
}

export default usersReducer

// import ACTIONS from "../actions";

// const users = []

// const useReducer = (state = users, action) => {
//     switch (action.type) {       
//         case ACTIONS.GET_ALL_USERS:
//             return action.payload
    
//         default:
//             return state
//     }
// }

// export default useReducer;