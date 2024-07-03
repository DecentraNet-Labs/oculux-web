import IVideoMetadata from "./IVideoMetadata"

export default interface IFileDetails {
  fid: string
  security: string
  metadata: IVideoMetadata
}