import './App.css';

import React, { useEffect } from 'react';

import { connect, Provider } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import Wind1 from "./assets/wind_1.png"
import Wind1Webp from "./assets/wind_1.webp"

import Wind2 from "./assets/wind_2.png"
import Wind2Webp from "./assets/wind_2.webp"

import Header from './layouts/Header';
import Asr from './pages/Asr/Asr';
import Documentation from './pages/Documentaton';
import NoMatch from './pages/NoMatch';
import Tts from './pages/Tts/Tts';
import { store } from './store';
import { getMessagesSelector } from './pages/Asr/selectors';

const App = () => {

 

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
          <Switch>
            <Route exact path="/">
              <Asr />
            </Route>
            <Route path="/tts">
              <Tts />
              
            </Route>
            <Route path="/documentation">
              <Documentation />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>

      </BrowserRouter>
    </Provider>
  )
}

export default App;

