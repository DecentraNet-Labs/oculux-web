import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IClientHandler, ClientHandler, IStorageHandler, StorageHandler } from '@jackallabs/jackal.js';
import IAppContext from './interfaces/IAppContext';
//import AppMsg from './interfaces/IAppMsg';
//import UploadHandler from './handlers/UploadHandler';

// Create the context with a default value
const AppContext = createContext<IAppContext | undefined>(undefined);

// A component to provide the context values
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientHandler, setClientHandler] = useState<IClientHandler | null>(null);
  const [storageHandler, setStorageHandler] = useState<IStorageHandler | null>(null);

  //const [msgs, setMsgs] = useState<AppMsg[]>([]);
  //const [uploadHandler, setUploadHandler] = useState<UploadHandler>(new UploadHandler())

  async function signIn(type: string) {
    //walletConfig.selectedWallet = type
    try {
      console.log("Signing In...")
      // [TODO]: wallet app selection
      const client = await ClientHandler.connect();
      const storage = await client.createStorageHandler()
      console.log("Finished waiting for storage handler init.")
      //await storage.buyMyStoragePlan(2)
      if (storage.readChildCount() < 0 && storage.readActivePath() == "s/Home") {
        await storage.initStorage()
        await storage.buyMyStoragePlan(2)
      }
      //uploadHandler.init(fileIO, addMessage)
      setClientHandler(client)
      setStorageHandler(storage)
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  async function signOut(swap?: string) {
      //if (swap && swap != walletConfig.selectedWallet) return;
      setClientHandler(null)
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
        signIn: signIn, 
        signOut: signOut,
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