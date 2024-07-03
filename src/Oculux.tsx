import { useEffect, useState } from 'react'
import logo from './assets/logo_white.png'
import './main.css'
import './styles/list.css'
import MediaPlayer from './components/MediaPlayer'
import Details from './components/Details'
import Explorer from './components/Explorer'

import {
  Files
} from '@jackallabs/jackal.js-protos'

import { WalletHandler, StorageHandler, IFiletreeParsedContents, FileIo, getFileTreeData } from 'jackal.js-plus'
import IFileDetails from './interfaces/IFileDetails'
import IVideoMetadata from './interfaces/IVideoMetadata'

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

function Oculux() {
  const [count, setCount] = useState(0)
  const [video, setVideo] = useState<IFileDetails | null>(null)
  
  const [Wallet, setWallet] = useState<WalletHandler>()
  const [FileIO, setFileIO] = useState()
  const [connected, setLogin] = useState(false)

  useEffect(() => {
    async function fn() {
      console.log("init")
      let wallet = await WalletHandler.trackWallet(walletConfig);
      let fileio = await FileIo.trackIo(wallet);
      setWallet(wallet);
      setFileIO(fileio);

      setLogin(true);
    }
    fn()
  }, [])

  async function loadVideo(path: string, owner: string, details: IVideoMetadata) {
    console.log(path, owner)
    const { success, value: { files } } = await getFileTreeData(path, owner, Wallet.getQueryHandler())
    if (!success) throw new Error(`[ERROR] File "${details.name}" not found! `)
    const { contents, editAccess, viewingAccess, trackingNumber } = files as Files
    let parsedContents: IFiletreeParsedContents
    try {
      parsedContents = JSON.parse(contents)
      console.log(contents)
    } catch (err) {
      console.error(err)
      parsedContents = { fids: [], security: 1 }
    }
    const fid = parsedContents.fids[0]
    const security = parsedContents.security
    setVideo({fid, security, metadata: details} as IFileDetails)
  } 

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
        {connected && Wallet ? <Explorer user={Wallet.getJackalAddress()} FileIO={FileIO} videoSelectHook={loadVideo} /> : <></>}
      </section>
      <section className='rpanel'>
        <MediaPlayer video={video}></MediaPlayer>
        <Details video={video?.metadata || null}></Details>
      </section>
    </main>
  )
}

export default Oculux
