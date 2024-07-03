export default interface IExtendedMetadata {
  title: string,
  lastUpload: number
  firstUpload: number
  videoLength: number
  videoResolution: string
  description: string
  author: string
  legacyFile: boolean
  webhooks?: string[]
}