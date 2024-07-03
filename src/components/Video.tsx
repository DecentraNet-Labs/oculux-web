import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from "video.js/dist/types/player";
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  videoUrl: string;  // Accept video URL directly as a prop
  type: string;
  options?: any;  // Make options optional since we'll merge them
  onReady?: (player: Player) => void;
}

const Video: React.FC<VideoPlayerProps> = ({ videoUrl, type, options, onReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  /*
  useEffect(() => {
    let player: Player | undefined;

    const initVideoPlayer = async () => {
      if (!videoRef.current) return;

      // Initialize Video.js with the video element
      player = videojs(videoRef.current);

      // Create a new MediaSource
      const mediaSource = new MediaSource();

      // Set the video source to the MediaSource URL
      videoRef.current.src = URL.createObjectURL(mediaSource);

      // Event handler for when MediaSource is open
      mediaSource.addEventListener('sourceopen', async () => {
        // Create a new source buffer
        const sourceBuffer = mediaSource.addSourceBuffer('video/mp4');

        // Fetch the octet-stream data
        const response = await fetch(videoUrl);
        if (!response.ok || !response.body) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Create a ReadableStream from the response body
        const stream = response.body;

        // Start reading the stream and append data to the source buffer
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          // Convert value (Uint8Array) to ArrayBuffer and append to source buffer
          sourceBuffer.appendBuffer(value.buffer);
        }

        // Start playback once enough data is available
        videoRef.current?.play();
      });
    };

    initVideoPlayer();

    // Clean up
    return () => {
      if (player) {
        player.dispose(); // Dispose Video.js player
      }
    };
  }, [videoUrl]);
  */
  useEffect(() => {
    // Initialize Video.js player
    if (!videoRef.current) return;
    console.debug("[START] Initializing Video.JS")
    const player = playerRef.current = videojs(videoRef.current, {
      ...options, 
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }]
    }, () => {
      console.log('Player is ready');
      onReady && onReady(player);
    });

    // Register the custom source handler
    videojs.getTech('Html5')?.registerSourceHandler({
      canHandleSource: function(source) {
        if (source.type === 'video/mp4') {
          return 1;
        }
        return 0;
      },
      handleSource: function(source, tech) {
        console.log("[SH] Handling New Source")
        const modifiedSource = { src: source.src, type: source.type };
        fetch(source.src)
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              const strippedBuffer = arrayBuffer.slice(0); // Adjust N to your needs
              const newBlob = new Blob([strippedBuffer], {type: source.type});
              const blobUrl = URL.createObjectURL(newBlob);
              modifiedSource.src = blobUrl;
              tech.setSrc(blobUrl);
            };
          })
          .catch(error => console.error('Error processing video data:', error));

        return {
          dispose() {
            URL.revokeObjectURL(modifiedSource.src);
          }
        };
      }
    }, 0);

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoUrl]);


  return (
      <div data-vjs-player>
          <video ref={videoRef} className="video-js" style={{ width: '100%' }}></video>
      </div>
  );
};

export default Video;