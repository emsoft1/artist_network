export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FIREND") {
        // state = Object.assign({}, state, {
        //     users: action.users
        // });
        state = {
            ...state,
            firend: action.firend,
        };
    }
    if (action.type == "READ_LIST") {
        // state = Object.assign({}, state, {
        //     users: action.users
        // });
        state = {
            ...state,
            list: action.list,
        };
    }
    if (action.type == "LAST_MSG") {
        // state = Object.assign({}, state, {
        //     users: action.users
        // });
        state = {
            ...state,
            msg: action.msg,
        };
    }
    if (action.type == "NEW_MSG") {
        // state = Object.assign({}, state, {
        //     users: action.users
        // });
        state = {
            ...state,
            msg: [...state.msg, action.newmsg],
        };
    }

    if (action.type == "UNFIREND") {
        state = {
            ...state,
            firend: state.firend.filter((user) => {
                if (user.id != action.id) {
                    return user;
                }
            }),
        };
    }

    if (action.type == "FIREND_A") {
        state = {
            ...state,
            firend: state.firend.map((user) => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return {
                        ...user,
                        accepted: true,
                    };
                }
            }),
        };
    }
    return state;
}
//  else {
//                     return {
//                         ...user,
//                         accepted: false,
//                     };
//                 }
