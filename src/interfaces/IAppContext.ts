import { IBaseMetaData, IClientHandler, IStorageHandler } from "@jackallabs/jackal.js";

export default interface AppContext {
  client: IClientHandler | null
  storage: IStorageHandler | null
  dir: string
  selected: IBaseMetaData | null,
  modal: string
  select: (item: IBaseMetaData) => void
  signIn: (type: string) => void
  signOut: (swap?: string) => void
}