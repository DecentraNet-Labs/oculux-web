import React, { useEffect, useRef } from 'react';
//import videojs from 'video.js';
import IFileDetails from '../interfaces/IFileDetails';

interface IPropsPlayer {
  video: IFileDetails | null
}

function MediaPlayer({ video }: IPropsPlayer) {
  const videoNode = useRef<HTMLVideoElement>(null);
  const mediaSource = useRef(new MediaSource());
  const sourceBuffer = useRef<SourceBuffer | null>(null);
  console.log("COMPONENT RELOAD")

  useEffect(() => {
    const setupVideoPlayer = () => {
      console.debug("<Setup Video Player>")
      const videoElement = videoNode.current;
      console.debug(videoElement)
      if (videoElement && video) {
        videoElement.src = URL.createObjectURL(mediaSource.current);
        mediaSource.current.addEventListener('sourceopen', sourceOpen, { once: true });
        console.log(mediaSource)
      }
    };

    const sourceOpen = () => {
      sourceBuffer.current = mediaSource.current.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      loadVideoChunks();
    };

    const loadVideoChunks = async () => {
      if (!video) return;
      console.log("BUFFERING")
      const response = await fetch('https://jackal-storage1.badgerbite.io/download/' + video?.fid);
      const reader = response.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        console.log("bytes")
        if (done) {
          mediaSource.current.endOfStream();
          return;
        }
        if (sourceBuffer.current && !sourceBuffer.current.updating) {
          sourceBuffer.current.appendBuffer(value);
          await new Promise(resolve => sourceBuffer.current.addEventListener('updateend', resolve, { once: true }));
          pump().catch(error => console.error('Error streaming video data:', error));
        } else {
          // If buffer is updating, wait and then try again
          setTimeout(() => pump(), 100); // Adjust timing as necessary
        }
        // Listen for the buffer to update, then call pump again to continue processing chunks.
        sourceBuffer.current?.addEventListener('updateend', pump, { once: true });
      };
      pump().catch(error => console.error('Error streaming video data:', error));
    };

    setupVideoPlayer();

    return () => {
      if (mediaSource.current && mediaSource.current.readyState === 'open') {
        mediaSource.current.endOfStream();
      }
      if (videoNode.current) {
        videoNode.current.src = ''; // Free up the blob URL
      }
    };
  }, [video]);

  return (
    <div id='player' className='player'>
      <video ref={videoNode} className="video-js" controls crossOrigin="anonymous"></video>
    </div>
  );
}

export default MediaPlayer;