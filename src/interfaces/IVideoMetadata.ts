import IExtendedMetadata from "./IExtendedMetadata"

export default interface IVideoMetadata {
  lastModified: number
  name: string
  size: number
  type: string
  security: number
  extended: IExtendedMetadata
}