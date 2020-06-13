import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducers';

const persistedReducer = persistReducer({ key: 'root', storage }, rootReducer);

export default () => {
  const store = createStore(persistedReducer, devToolsEnhancer());
  const persistor = persistStore(store);
  return { store, persistor };
};
