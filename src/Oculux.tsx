import { useEffect } from 'react'
import logo from './assets/logo_white.png'
import './main.css'
import './styles/list.css'
import MediaPlayer from './components/MediaPlayer'
//import Details from './components/Details'
import Explorer from './components/Explorer'

import { AppProvider, loadContext } from './AppContext'

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

function Oculux() {
  const app = loadContext();

  useEffect(() => {
    console.log("init")
    if (!app.client)
      app.signIn('keplr')
  }, [])

  return (
    <main className='hfl'>
      <section className='lpanel'>
        <div id='header-page' className='header'>
          <img src={logo} />
        </div>
        <div id='wrapper-pinned' className='pinned'>
          <div id='pinned' className='container'>
            <div className='title'>PINNED</div>
            <div>
              <div className='NA'>NO PINNED VIDEOS</div>
            </div>
          </div>
        </div>
        <Explorer />
      </section>
      <section className='rpanel'>
        <MediaPlayer video={null}></MediaPlayer>
        
      </section>
    </main>
  )
}

export default Oculux
//<Details video={video?.metadata || null}></Details>