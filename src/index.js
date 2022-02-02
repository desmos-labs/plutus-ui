import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

import {Buffer} from 'buffer';

global.Buffer = global.Buffer || Buffer

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
