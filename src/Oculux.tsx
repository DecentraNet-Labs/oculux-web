import { useState } from 'react'
import logo from './assets/logo_white.png'
import './main.css'
import './styles/list.css'
import Player from './components/Player'
import Details from './components/Details'
import Explorer from './components/Explorer'



function Oculux() {
  const [count, setCount] = useState(0)

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
        <Explorer></Explorer>
      </section>
      <section className='rpanel'>
        <Player></Player>
        <Details></Details>
      </section>
    </>
  )
}

export default Oculux
