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

//import { osmosis, getSigningOsmosisClient } from 'osmojs'
//import { getRoutesForTrade, calcAmountWithSlippage } from "@osmonauts/math";
import { coin } from '@cosmjs/amino';

/*const {
  swapExactAmountIn,
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;
*/
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
      //const signer = wallet.getSigner()
      /*await (window as any).keplr.enable("osmosis-1");

      const offlineSigner = (window as any).getOfflineSigner("osmosis-1");
  
      const accounts = await offlineSigner.getAccounts();

      const client = await getSigningOsmosisClient({
        rpcEndpoint: "https://rpc.osmosis.zone/",
        signer: offlineSigner // OfflineSigner
      });

      
      //const tokenOutMinAmount = calcAmountWithSlippage("ibc/C360EF34A86D334F625E4CBB7DA3223AEA97174B61F35BB3758081A8160F7D9B", "");

      const msgs = [swapExactAmountIn({
        "sender": "osmo1l4c0w4mmz45d9ekhv35xqtcceek6zcg2j36d9m",
        "routes": [
          {
            "poolId": BigInt(1496),
            "tokenOutDenom": "ibc/C360EF34A86D334F625E4CBB7DA3223AEA97174B61F35BB3758081A8160F7D9B"
          }
        ],
        tokenIn: coin(30000000000,"ibc/BADB06C54ADD5BC4C8B74982F961CB0287BAE326E799FCD8D03387EB8BB7D550"),
        tokenOutMinAmount: "330000000"
      })]

      const fee = {
        "gas": "760266",
        "amount": [
          {
            "amount": "2281",
            "denom": "uosmo"
          }
        ]
      }
*/
      /*const msgs = [swapExactAmountIn({
        "sender": "osmo1l4c0w4mmz45d9ekhv35xqtcceek6zcg2j36d9m",
        "routes": [
          {
            "poolId": BigInt(1573),
            "tokenOutDenom": "ibc/C12C353A83CD1005FC38943410B894DBEC5F2ABC97FC12908F0FB03B970E8E1B"
          }
        ],
        tokenIn: coin(617637405,"ibc/C360EF34A86D334F625E4CBB7DA3223AEA97174B61F35BB3758081A8160F7D9B"),
        tokenOutMinAmount: "1"
      })]

      const fee = {
        "gas": "760266",
        "amount": [
          {
            "amount": "2281",
            "denom": "uosmo"
          }
        ]
      }
      const resp = await client.signAndBroadcast(accounts[0].address, msgs, fee)
      console.log(resp)
      */
      let fileio = await FileIo.trackIo(wallet);
      setWallet(wallet);
      setFileIO(fileio);

      setLogin(true);
      //var fileIo = await jackal_js_1.FileIo.trackIo(wallet);
      //var f = new File([process.env.PASSWORD], "password.txt");
      //var handler = await jackal_js_1.FileUploadHandler.trackFile(f, "s/data");
      //var readyFile = handler.getForUpload();

/*
      let d = []

      let x = 0
      for (const key of Object.keys(files)) {
        const f = files[key]

        const fDetails = await getFileTreeData("s/Home/" + f.name, wallet.getJackalAddress(), wallet.getQueryHandler())
        console.log(fDetails)
        const dFiles = fDetails.value.files
        if (dFiles == null) {
          continue
        }
        const fidList = JSON.parse(dFiles.contents)
        const newFid = fidList.fids[0]

        d[x] = { name: key, fid: newFid }
        x++
      }
      console.log(d)
      */
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
    <>
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
    </>
  )
}

export default Oculux
