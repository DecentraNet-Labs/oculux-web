import { useEffect, useRef, useState } from 'react';

import { 
  //resolve_fileIcon,
  //resolve_fileSecurity, 
  resolve_fileSize, 
  resolve_date 
} from '../utils';

import '../styles/Explorer.css'
import ico_dir from '../assets/icon-directory.svg'

import { loadContext } from '../AppContext';

import List, { IListRow, ListStatus } from './List';
import IAppContext from '../interfaces/IAppContext';

interface IPropsExplorer {
}

const ListColumns = [
  {name: 'TITLE', size: 'xlg'},
  {name: 'SIZE', size: 'sm'},
  {name: 'SECURITY', size: 'sm'},
  {name: 'MODIFIED', size: 'md'}
  // [TODO]: Actions
]

function Explorer({  }: IPropsExplorer) {
  //const [focus, setFocus] = useState<IStorageItem | null>(null)

  const [renderData, setRenderData] = useState<IListRow[]>([]);

  const [uploadToggle, setUpload] = useState(false)
  const [newDirToggle, setNewDir] = useState(false)
  const [pending, setPending] = useState<boolean>(false)

  const app: IAppContext = loadContext();
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

  }, [,pending])

  useEffect(() => {
    // Function to handle key press events
    function handleKeyPress(event: any) {
        if (event.key === 'Escape') {
          // reset primary focus, maybe this should be done on a higher level...
        }
    }
    document.addEventListener('keydown', handleKeyPress);
    // Clean up the event listener
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log(app.dir)
    console.log("refreshing list")
    refresh()
    // [TODO]: Test - does this work??
  }, [app.storage?.readActivePath()])

  function processFolders() {
    const processed: IListRow[] = []
    // [TODO]: expose `children` using a getter
    for (const folder of Object.values(app.storage?.children.folders || [])) {
      processed.push({
        //click: changeDirectory
        data: [
          folder.whoAmI,
          folder.count + " Items",
          null,
          null
          // [TODO]: Actions
        ],  // Name, file count, blanks, actions
        focused: false
      })
    }
    return processed
  }

  function processFiles() {
    const processed: IListRow[] = []
    for (const file of Object.values(app.storage?.children.files || [])) {
      processed.push({
        click: () => app.select(file),
        data: [
          file.fileMeta.name, 
          resolve_fileSize(file.fileMeta.size), 
          /*resolve_fileSecurity(file.extendedMeta?.security)*/,
          resolve_date(file.fileMeta.lastModified)
          // [TODO]: Actions
        ],  // Title, size, date modified, date of upload, actions
        focused: false
      })
    }
    return processed
  }

  function renderPath() {
    const subdirs = app.dir.slice(2).split('/')
    //console.log(subdirs)
    let elements = [<div onClick={() => {!uploadToggle ? refresh('s/' + subdirs.slice(0,1).join('/')) : null}} className='subdir'>{subdirs[0]}</div>]
    // var vs. let over here:
    for (let i = 1; i < subdirs.length; i++)
      elements.push(<><div className='seperator'>{'❯'}</div><div onClick={() => {!uploadToggle ? refresh('s/' + subdirs.slice(0,i+1).join('/')) : null}} className='subdir'>{subdirs[i]}</div></>)
    return elements
  }

  async function refresh(path?: string) {
    // get new set of files, make sure it changed
    // [TODO]: Expose `refreshActiveFolder`  (protected by default)
    if (!app.storage) return
    setPending(true)
    setRenderData([])
    if (path && path != app.storage.readActivePath()) {
      await app.storage?.changeActiveDirectory(path)
    } else {
      await app.storage.refreshActiveFolder()
    }
    const folders = processFolders()
    const files = processFiles()
    setRenderData([...folders, ...files])
    // [TODO]: set selected to current folder
    setPending(false)
  }

  return (
    <section className='explorer'>
      <div className='header hfl'>
        <div className='path'>
          <img className='icon' src={ico_dir}></img>
            <div className='path inner hfl' ref={pathRef}>
              {renderPath()}
            </div>
        </div>
        <div className='actions'>
          {!uploadToggle ? 
          <>
            <button className='upload' onClick={() => app.storage ? setNewDir(true) : null}>
            ➕ NEW FOLDER
            </button>
            <button className='upload' onClick={() => app.storage ? setUpload(true) : null}>
            ➕ UPLOAD
            </button>
          </>
          : null}
        </div>
      </div>
      <List columns={ListColumns} data={renderData} select={true} status={ListStatus.ACTIVE} />
    </section>
  )
}

export default Explorer
