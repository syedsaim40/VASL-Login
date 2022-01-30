import React from 'react'
import {createStore} from 'redux';
import rootReducer from './reducers/';
import {Provider} from 'react-redux';
//import thunk from 'redux-thunk';

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    //applyMiddleware(thunk),

function DataProvider({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider;
