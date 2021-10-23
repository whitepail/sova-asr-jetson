import {applyMiddleware,combineReducers,createStore, compose} from 'redux';
import thunk from 'redux-thunk';

import asr from './pages/Asr/reducer';
import tts from './pages/Tts/reducer';


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

export const store = createStore(combineReducers({ asr,tts }), [], composeEnhancers(applyMiddleware(thunk)));
