import { IChildMetaDataMap, StorageHandler } from "@jackallabs/jackal.js";


export class OculuxStorageHandler extends StorageHandler {
  
  public get contents() : IChildMetaDataMap {
    return this.children
  }
  
  public async refresh() {
    await this.refreshActiveFolder()
  }

}