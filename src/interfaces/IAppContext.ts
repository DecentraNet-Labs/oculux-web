import { ClientHandler, StorageHandler } from "@jackallabs/jackal.js";

export default interface AppContext {
  client: ClientHandler
  storage: StorageHandler
}