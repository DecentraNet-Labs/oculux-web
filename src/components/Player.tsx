import { useState } from 'react'
import '../main.css'
import '../styles/player.css'
import ico_video from '../assets/icon-video.svg'
import ico_star from '../assets/icon-star.svg'
import ico_starSelected from '../assets/icon-star_selected.svg'

function Player() {
  const [count, setCount] = useState(0)

  return (
    <div id='player' className='player'>
      <div className='path'>
        <img className="icon" src={ico_video} />
        <div>JKL://oculux/videos/sample.mp4</div>
      </div>
      <div className='video'></div>
      <div className='footer'>
        <div className='title'>My First Video</div>
        <div className='actions'>
          <img className='star' src={ico_starSelected} />
        </div>
      </div>
      <div className='description'>The first video upload via Oculux!</div>
    </div>
  );
}

export default Player