import { combineReducers } from 'redux';
import volume from './volume';
import defaultLoop from './default-loop';

export default combineReducers({
  volume,
  defaultLoop,
});
