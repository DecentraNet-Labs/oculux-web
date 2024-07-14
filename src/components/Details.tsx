import { useState } from 'react'
import '../main.css'
import '../styles/Details.css'
import ico_play from '../assets/icon-play.svg'
import { resolve_date, resolve_fileSize, resolve_videoType } from '../utils'
import IVideoMetadata from '../interfaces/IVideoMetadata'
import { loadContext } from '../AppContext'
import { IFileMetaData, IFolderMetaData } from '@jackallabs/jackal.js'

interface IPropsDetails {
  edit: () => void
}

function Details({ edit }: IPropsDetails) {
  const [count, setCount] = useState(0)

  const app = loadContext()
  // [TODO]: Add logic for no delete twice

  if (!app.selected) {
    return (
      <section className='details'></section>
    )
  }
  else if (app.selected.metaDataType == 'folder') {
    const meta = app.selected as IFolderMetaData
    return (
      <section className='details'>
        <div className='thumbnail'>
          <img />
          <div className='foreground'>
            <img className='play' src={ico_play} />
          </div>
        </div>
        <div className='metadata'>
          <div className='title'>
            {meta.whoAmI}
          </div>
          <div className='detail'>
            <div className='name'>Type</div>
            <div className='value'>Folder</div>
          </div>
          <div className='detail'>
            <div className='name'>Files</div>
            <div className='value'>{meta.count}</div>
          </div>
        </div>
        <div className='actions'>
          <button className='action red' onClick={() => null}>DELETE</button>
        </div>
      </section>
    );
  } else if (app.selected.metaDataType == 'file') {
    const meta = app.selected as IFileMetaData
    return (
      <section className='details'>
        <div className='thumbnail'>
          <img />
          <div className='foreground'>
            <img className='play' src={ico_play} />
          </div>
        </div>
        <div className='metadata'>
          <div className='title'>
            {meta.fileMeta.name /*[TODO]: Title instead of name */}
          </div>
          <div className='detail hfl'>
            <div className='name'>Type</div>
            <div className='value'>{resolve_videoType(meta.fileMeta.type) || meta.fileMeta.name.split('.').pop()?.toUpperCase() || "Unknown"}</div>
          </div>
          <div className='detail hfl'>
            <div className='name'>Size</div>
            <div className='value'>{resolve_fileSize(meta.fileMeta.size) || "Unknown"}</div>
          </div>
          <div className='detail hfl'>
            <div className='name'>Last Modified</div>
            <div className='value'>{resolve_date(meta.fileMeta.lastModified) || "Unknown"}</div>
          </div>
          <div className='detail hfl'>
            <div className='name'>Date Uploaded</div>
            <div className='value'>{resolve_date(meta.fileMeta.lastModified) || "Unknown"}</div>
          </div>
          <div className='detail hfl'>
            <div className='name'>Creator</div>
            <div className='value'>{meta.extended?.author || "---"}</div>
          </div>
          <div className='detail hfl'>
            <div className='name'>Location</div>
            <div className='value'>{meta.extended?.location || "---"}</div>
          </div>
          <div className='detail'>
            <div className='name'>Description</div>
            <div className='value'>{meta.extended?.author || "------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"}</div>
          </div>
        </div>
        <div className='actions vfl'>
          <button className='action green' onClick={() => null}>DOWNLOAD</button>
          <button className='action blue' onClick={() => null}>SHARE</button>
          <button className='action grey' onClick={edit}>EDIT</button>
          <button className='action red' onClick={() => null}>DELETE</button>
        </div>
      </section>
    )
  } else {
    // [TODO]: Error Handle
  }
}

export default Details


/*
      <div className='row'><b>File Type </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{resolve_videoType('')}</div>
      <div className='row'><b>File Size </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{resolve_fileSize(0)}</div>
      <div className='row'><b>Video Length </b>&nbsp;&nbsp;&nbsp;00:02:31</div>
      <div className='row'><b>Date Uploaded</b>&nbsp;&nbsp;&nbsp;December 25th, 2023</div>
      <div className='row'><b>Last Updated </b>&nbsp;&nbsp;&nbsp;December 26th, 2023</div>
      <div className='actions'>
        <div className='button'>DOWNLOAD</div>
        <div className='button red'>DELETE</div>
      </div>
      */