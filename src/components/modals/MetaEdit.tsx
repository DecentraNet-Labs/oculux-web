import { IFileMetaData } from "@jackallabs/jackal.js";
import { loadContext } from "../../AppContext";

import ico_close from '../../assets/icon-x.svg'

import '../../styles/modals.css'
import { resolve_date, resolve_fileSize, resolve_videoType } from "../../utils";
import { useState } from "react";

export interface ModalProps {
  quit: () => void;
}

interface ExtendedMeta {
  title: string
  author: string
  location: string
  description: string
}

interface FileMetaData extends IFileMetaData {
  extended: ExtendedMeta
}

export default function MetaEdit({ quit }: ModalProps) {
  const app = loadContext()
  const metaInit = {... app.selected as FileMetaData}
  if (!metaInit.extended) {
    metaInit.extended = {
      title: metaInit.fileMeta.name,
      author: "",
      location: "",
      description: ""
    }
  }

  const [meta, setMeta] = useState<FileMetaData>(metaInit)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeta((prevMeta) => {
      // Create a new object to update the state
      const metaUpdated = { ...prevMeta };
      metaUpdated.extended.title = e.target.value
      return metaUpdated;
    });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeta((prevMeta) => {
      // Create a new object to update the state
      const metaUpdated = { ...prevMeta };
      metaUpdated.extended.author = e.target.value
      return metaUpdated;
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeta((prevMeta) => {
      // Create a new object to update the state
      const metaUpdated = { ...prevMeta };
      metaUpdated.extended.location = e.target.value
      return metaUpdated;
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMeta((prevMeta) => {
      // Create a new object to update the state
      const metaUpdated = { ...prevMeta };
      metaUpdated.extended.description = e.target.value
      return metaUpdated;
    });
  };

  return (
    <div className="modal">
      <div className="bg" onClick={quit}></div>
      <div className="inner metaedit vfl">
        <div className="header hfl">
          <img src={ico_close} onClick={quit}></img>
          <input className="title" spellCheck="false" value={meta.extended.title} onChange={handleTitleChange}></input>
        </div>
        <div className="contents">
          <div className="row title">File Metadata</div>
          <div className="minirow">
            <div className="kv">
              <span className="k">Size</span>
              <span className="v">{resolve_fileSize(meta.fileMeta.size) || "Unknown"}</span>
            </div>
            <div className="kv">
              <span className="k">Date Uploaded</span>
              <span className="v">{resolve_date(meta.fileMeta.lastModified) || "Unknown"}</span>
            </div>
          </div>
          <div className="minirow">
            <div className="kv">
              <span className="k">Type</span>
              <span className="v">{resolve_videoType(meta.fileMeta.type) || meta.fileMeta.name.split('.').pop()?.toUpperCase() || "Unknown"}</span>
            </div>
            <div className="kv">
              <span className="k">Last Modified</span>
              <span className="v">{resolve_date(meta.fileMeta.lastModified) || "Unknown"}</span>
            </div>
          </div>
          <div className="row title">Video Details</div>
          <div className="row">
            <img className="icon" />
            <div className="details">
              <div className="subtitle">Author / Creator</div>
              <input className="value" value={meta.extended.author} onChange={handleAuthorChange} />
            </div>
          </div>
          <div className="row">
            <img className="icon" />
            <div className="details">
              <div className="subtitle">Location(s)</div>
              <input className="value" value={meta.extended.location} onChange={handleLocationChange} />
            </div>
          </div>
          <div className="row">
            <img className="icon" />
            <div className="details">
              <div className="subtitle">Description</div>
              <textarea className="value" value={meta.extended.description} onChange={handleDescriptionChange} />
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="action green" onClick={() => quit()}>
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  )
}