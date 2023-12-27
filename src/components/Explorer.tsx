import { useState } from 'react'
import ico_download from './assets/icon-download.svg'
import ico_delete from './assets/icon-delete.svg'
import ico_video from './assets/icon-video.svg'
import ico_back from './assets/icon-arrowBack.svg'

function Explorer() {

  return (
    <div id='explorer' className='explorer container list'>
          <div className='path'>
            <img className='icon large action' src={ico_back} />
            <input className='pathInput' type='text' placeholder={"JKL://oculux/videos/"} />
          </div>
          <div className='header'>
            <div className='column xsmall'></div>
            <div className='column large'>TITLE</div>
            <div className='column large'>DESCRIPTION</div>
            <div className='column right'>UPLOADED</div>
            <div className='column small'></div>
          </div>
          <div className='items'>
            <div className='wrapper-row'>
              <div className='row'>
                <div className='column xsmall actions'><img className="icon" src={ico_video} /></div>
                <div className='column large'>My First Video</div>
                <div className='column large'>The first video upload via Oculux!</div>
                <div className='column right'>12/25/2023</div>
                <div className='column small actions'>
                  <img className="icon" src={ico_download} />
                  <img className="icon" src={ico_delete} />
                </div>
              </div>
            </div>
            <div className='wrapper-row'>
              <div className='row'>
                <div className='column xsmall actions'><img className="icon" src={ico_video} /></div>
                <div className='column large'>My Second Videooooooooo</div>
                <div className='column large'>testing overlow</div>
                <div className='column right'>12/26/2023</div>
                <div className='column small actions'>
                  <img className="icon" src={ico_download} />
                  <img className="icon" src={ico_delete} />
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Explorer