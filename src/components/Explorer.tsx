import { useEffect, useState } from 'react';

import { 
  //resolve_fileIcon,
  //resolve_fileSecurity, 
  resolve_fileSize, 
  resolve_date 
} from '../utils';

import '../styles/Explorer.css'
//import ico_dir from '../assets/icon-directory.svg'
import { loadContext } from '../AppContext';

import List, { IListRow, ListStatus } from './List';
import IAppContext from '../interfaces/IAppContext';

interface IPropsExplorer {
}

const ListColumns = [
  {name: 'Title', size: 'xlg'},
  {name: 'Size', size: 'sm'},
  {name: 'Security', size: 'sm'},
  {name: 'Modified', size: 'md'}
  // [TODO]: Actions
]

function Explorer({  }: IPropsExplorer) {
  //const [focus, setFocus] = useState<IStorageItem | null>(null)

  const [renderData, setRenderData] = useState<IListRow[]>([]);
  const [pending, setPending] = useState<boolean>(false)

  // primary focus in context

  const app: IAppContext = loadContext();

  useEffect(() => {
    if (!pending) {
      refresh()
    }
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
    setRenderData((prevItems) => {
      return [ ...(prevItems || []), ...processed ];
    });
  }

  function processFiles() {
    const processed: IListRow[] = []
    for (const file of Object.values(app.storage?.children.files || [])) {
      processed.push({
        //click: selectFile
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
    setRenderData((prevItems) => {
      return [ ...(prevItems || []), ...processed ];
    });
  }

  async function refresh() {
    // get new set of files, make sure it changed
    // [TODO]: Expose `refreshActiveFolder`  (protected by default)
    if (!app.storage) return
    setPending(true)
    await app.storage.refreshActiveFolder()
    processFolders()
    processFiles()
    setPending(false)
  }

  return (
    <section className='explorer'>
      <List columns={ListColumns} data={renderData} select={true} status={ListStatus.ACTIVE} />
    </section>
  )
}

export default Explorer
