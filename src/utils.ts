import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import IVideoFileMetadata from './interfaces/IVideoFileMetadata';

const ffmpeg = new FFmpeg();

export const resolve_videoType = (t: string) => {
  switch (t) {
    case "video/mp4":
      return "MP4"
    case "video/quicktime":
      return "MOV"
    default:
      return t.replace("video/", "")
  }
}

export const resolve_videoSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function getVideoFileMetadata(file: File): Promise<IVideoFileMetadata> {
  return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
  });
}

/*
export async function getVideoLength_FFMPEG(file: File): Promise<number> {
  // Load ffmpeg
  console.log("LOADING FFMPEG")
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`,"text/javascript"),
  });
  console.log("FFMPEG Loaded")
  // Read the file using FileReader API
  const reader = new FileReader();
  const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
  });

  // Write the file data to ffmpeg
  ffmpeg.writeFile(File.name, new Uint8Array(fileData));
  console.log("FILE SUBMITTED")
  // Run ffprobe to get video metadata
  await ffmpeg.exec(['-i', File.name, 'output.txt']);
  console.log("FILE ANALYZED")
  // Read the output file
  const output = await ffmpeg.readFile('output.txt');
  console.log(output)
  // Parse the output to get the video duration
  const durationRegex = /Duration: (\d\d:\d\d:\d\d.\d\d)/;
  const match = durationRegex.exec(output ? output.toString() : '');
  if (match && match[1]) {
      const duration = match[1];
      const [hours, minutes, seconds] = duration.split(':').map(parseFloat);
      return hours * 3600 + minutes * 60 + seconds;
  } else {
      throw new Error('Failed to parse video duration');
  }
}
*/