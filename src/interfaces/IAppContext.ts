import { IClientHandler, IStorageHandler } from "@jackallabs/jackal.js";

export default interface AppContext {
  client: IClientHandler | null
  storage: IStorageHandler | null
  signIn: (type: string) => void
  signOut: (swap?: string) => void
}