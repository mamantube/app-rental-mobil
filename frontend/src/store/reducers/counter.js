const initialState = {
    value: 0,
};

export const reducerCounter = ( state = initialState, actions) => {
    switch (actions.type) {
        case "SET_INCREMENT":
            return {
                ...state,
                value: actions.value,
            };    
        case "SET_DECERMENT":
            return {
                ...state,
                value: state.value - 1,
            };    
        default:
            return state;
    }
};
