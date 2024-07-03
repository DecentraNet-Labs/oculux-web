import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IClientHandler, ClientHandler, IStorageHandler, StorageHandler } from '@jackallabs/jackal.js';
import IAppContext from './interfaces/IAppContext';
import AppContext from './interfaces/IAppContext';
//import AppMsg from './interfaces/IAppMsg';
//import UploadHandler from './handlers/UploadHandler';

// Create the context with a default value
const AppContext = createContext<IAppContext | undefined>(undefined);

// A component to provide the context values
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientHandler, setClientHandler] = useState<IClientHandler>();
  const [storageHandler, setStorageHandler] = useState<IStorageHandler>();

  //const [msgs, setMsgs] = useState<AppMsg[]>([]);
  //const [uploadHandler, setUploadHandler] = useState<UploadHandler>(new UploadHandler())

  async function signIn(type: string) {
    //walletConfig.selectedWallet = type
    try {
      // [TODO]: wallet app selection
      const client = await ClientHandler.connect();
      const storage = await StorageHandler.init(client);
      //uploadHandler.init(fileIO, addMessage)
      setClientHandler(client)
      setStorageHandler(storage)
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  async function signOut(swap?: string) {
      //if (swap && swap != walletConfig.selectedWallet) return;
      setClientHandler(undefined)
      if (swap) {
        //await signIn(walletConfig.selectedWallet)
      } else {
        //walletConfig.selectedWallet = ''
      }
  }

  /*function addMessage(msg: AppMsg) {
      console.warn("adding message")
      console.log(msg)
      setMsgs(prev => [...prev, msg])
  }*/

  return (
      <AppContext.Provider value={{
      client: clientHandler,
      storage: storageHandler,
      //Upload: uploadHandler,
      //messages: msgs,
      //addMessage: addMessage, 
      signIn: signIn, signOut: signOut,
      }}>
      {children}
      </AppContext.Provider>
  );
};

export const loadContext = (): IAppContext => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('loadContext must be used within a AppContext Provider');
  }
  return context;
};

export default AppContext;