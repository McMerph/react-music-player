import React from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import initStore from './store';

// eslint-disable-next-line react/prop-types
const wrapRootElement = ({ element }) => {
  const { store, persistor } = initStore();

  return (
    <ReactReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {element}
      </PersistGate>
    </ReactReduxProvider>
  );
};

export default wrapRootElement;
