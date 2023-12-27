import { useState } from 'react'
import '../main.css'
import '../styles/details.css'
import ico_video from '../assets/icon-video.svg'
import ico_star from '../assets/icon-star.svg'
import ico_starSelected from '../assets/icon-star_selected.svg'

function Details() {
  const [count, setCount] = useState(0)

  return (
    <div id='details' className='details'>
      <div>
        <div className='row'><b>File Type </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MP4</div>
        <div className='row'><b>File Size </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.34 GB</div>
        <div className='row'><b>Video Length </b>&nbsp;&nbsp;&nbsp;00:02:31</div>
        <div className='row'><b>Date Uploaded</b>&nbsp;&nbsp;&nbsp;December 25th, 2023</div>
        <div className='row'><b>Last Updated </b>&nbsp;&nbsp;&nbsp;December 26th, 2023</div>
        <div className='actions'>
          <div className='button'>DOWNLOAD</div>
          <div className='button red'>DELETE</div>
        </div>
      </div>
      <div>
        <div className='subtitle'>SHARED WITH</div>
        <div className='sharing'>
          <div className='NA'>NOT SHARED</div>
        </div>
      </div>
    </div>
  );
}

export default Details