import { useEffect, useState } from 'react'

import './main.css'
import './styles/list.css'
import MediaPlayer from './components/MediaPlayer'
//import Details from './components/Details'
import Explorer from './components/Explorer'

import { AppProvider, loadContext } from './AppContext'
import Header from './components/Header'
import Details from './components/Details'
import MetaEdit from './components/modals/MetaEdit'

/*
const walletConfig = {
  chainConfig: {
    chainId: 'jackal-1',
    chainName: 'Jackal Mainnet',
    rpc: 'https://rpc.jackalprotocol.com',
    rest: 'https://api.jackalprotocol.com',
    bip44: {
      coinType: 118
    },
    coinType: 118,
    stakeCurrency: {
      coinDenom: 'JKL',
      coinMinimalDenom: 'ujkl',
      coinDecimals: 6
    },
    bech32Config: {
      bech32PrefixAccAddr: 'jkl',
      bech32PrefixAccPub: 'jklpub',
      bech32PrefixValAddr: 'jklvaloper',
      bech32PrefixValPub: 'jklvaloperpub',
      bech32PrefixConsAddr: 'jklvalcons',
      bech32PrefixConsPub: 'jklvalconspub'
    },
    currencies: [
      {
        coinDenom: 'JKL',
        coinMinimalDenom: 'ujkl',
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: 'JKL',
        coinMinimalDenom: 'ujkl',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.002,
          average: 0.002,
          high: 0.02
        }
      }
    ],
    features: []
  },
  signerChain: 'jackal-1',
  enabledChains: ['jackal-1'],
  queryAddr: 'https://grpc.jackalprotocol.com',
  txAddr: 'https://rpc.jackalprotocol.com',
  selectedWallet: "keplr",
}
*/

enum ModalType {
  DELETE,
  EDIT,
  SHARE
}

function Oculux() {
  const app = loadContext();
  const [modal, setModal] = useState<ModalType | null>(null)


  useEffect(() => {
    console.log("init")
    if (!app.client)
      app.signIn('keplr')
  }, [])

  return (
    <>
      <main>
        <Header />
        <Details edit={() => setModal(ModalType.EDIT)} />
        <Explorer />
      </main>
      {modal === ModalType.EDIT ? <MetaEdit quit={() => setModal(null)} /> : null}
    </>
  )
}

export default Oculux
//<Details video={video?.metadata || null}></Details>