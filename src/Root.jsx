import React from 'react';
import Main from './Main';
import './style.scss';

import { BrowserRouter as Router } from "react-router-dom";

/*
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/Reducers';
*/

//import plants from './data/plants.json';
//import fields from './data/fields.json';


//initate store
//const store = createStore(rootReducer, { plantsObject: plants, fieldsObject: fields });
//console.log(store);
//store.dispatch(updatePlants(plants));
//console.log(store.getState());


const Root = () => {
  return(
      <Router>
        <Main />
      </Router>
  )
}

export default Root

/*
const Root = () => {
  return(
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  )
}
*/
