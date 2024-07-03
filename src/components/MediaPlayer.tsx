import { useEffect, useRef, useState } from 'react'
import Video from './Video'
import videojs from 'video.js';
import Player from "video.js/dist/types/player";
import '../main.css'
import '../styles/player.css'
import ico_video from '../assets/icon-video.svg'
import ico_star from '../assets/icon-star.svg'
import ico_starSelected from '../assets/icon-star_selected.svg'
import IVideoMetadata from '../interfaces/IVideoMetadata'
import IFileDetails from '../interfaces/IFileDetails'
import '../styles/video.css';

import '../OctetStreamHandler'

interface IPropsPlayer {
  video: IFileDetails | null
}

function MediaPlayer({ video }: IPropsPlayer) {
  const [count, setCount] = useState(0)
  const videoNode = useRef<HTMLVideoElement>(null);
  const player = useRef<Player | null>(null);
  const [blobURL, setBlobURL] = useState<string>('');

  const videoOptions = {
    autoplay: true,
    controls: true,
  };

  useEffect(() => {
    const options = {
      autoplay: true,
      controls: true,
    };
    if (videoNode.current && !player.current) {
      player.current = videojs(videoNode.current, {
        //techOrder: ['OctetStreamHandler', 'html5'],
        ...options
      }, function() {
        console.log('Player is ready');
        //onReady && onReady(player.current!);
      });
    } else if (player.current) {
      player.current.src({ src: blobURL, type: 'video/mp4' });
    }
  }, [blobURL])

  useEffect(() => {
    async function loadVideo() {
      const response = await fetch('https://jackal-storage1.badgerbite.io/download/' + video?.fid);
      const blob = await response.blob();
      setBlobURL(URL.createObjectURL(blob));
    }
    if (video)  loadVideo()
  }, [video])

  return (
    <div id='player' className='player'>
      <div className='path'>
        <img className="icon" src={ico_video} />
        <div>JKL://oculux/videos/sample.mp4</div>
      </div>
      <div className='video'>
      {video ? <Video videoUrl={'https://jackal-storage1.badgerbite.io/download/' + video.fid} type={video.metadata.type} options={videoOptions} /> : <></>}
      </div>
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


//<video ref={videoNode} className="video-js" crossOrigin="anonymous"></video>
/*
        <video ref={videoNode} className="video-js" crossOrigin="anonymous">
          <source src="https://jackal-storage1.badgerbite.io/download/jklf1mtcccgmum98g3032l04zzrwh8qp5w32e8mhkhaj7kxulu0rq7rfsrn7ac0" type='video/mp4' />
        </video>
*/
// {video ? <Video videoUrl={'https://jackal-storage1.badgerbite.io/download/' + video.fid} type={video.metadata.type} options={videoOptions} /> : <></>}
//<video crossOrigin="anonymous" src="https://jackal-storage1.badgerbite.io/download/jklf1gtzn4jkd9hdnhkyjgv82q5yra8nx2u3pmkg6886z2qxzl906rxdst7sute" />
export default MediaPlayer