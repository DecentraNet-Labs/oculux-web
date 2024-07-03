import { useEffect, useRef, useState } from 'react';

import { resolve_fileIcon, resolve_fileSecurity, resolve_fileSize, saveFile } from '../utils';

import '../styles/Explorer.css'
import ico_dir from '../assets/icon-directory.svg'
import { loadUser } from '../UserContext';

import List from './List';

interface IStorageItems {
  directories: string[]
  files: any
}

interface IPropsExplorer {
  items: IStorageItems | null
  dir: string
  refresh: () => void
  addToPath: (dir: string) => void
}

function Explorer({ items, dir, refresh, addToPath }: IPropsExplorer) {
  const [focus, setFocus] = useState<IStorageItem | null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [fileActions, setActions] = useState<any>({})
  
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const scrollableContentWrapperRef = useRef<HTMLDivElement>(null);

  const user = loadUser();

  useEffect(() => {
    const headerWrapper = headerWrapperRef.current;
    const scrollableContentWrapper = scrollableContentWrapperRef.current;

    const syncScroll = () => {
      if (headerWrapper && scrollableContentWrapper) {
        headerWrapper.scrollLeft = scrollableContentWrapper.scrollLeft;
      }
    };

    scrollableContentWrapper?.addEventListener('scroll', syncScroll);

    return () => {
      scrollableContentWrapper?.removeEventListener('scroll', syncScroll);
    };
  }, [items])

  useEffect(() => {
    if (!pending) {
      setFocus(null)
    }
  }, [user.FileIO.readActivePath(), pending])

  useEffect(() => {
    // Function to handle key press events
    function handleKeyPress(event: any) {
        if (focus && event.key === 'Escape') {

          setFocus(null)
        }
    }

    document.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const downloadFile = async (filename: string) => {
    if (!user.FileIO) return;
    const downloadDetails = {
      rawPath: dir + "/" + filename, // manual complete file path OR pathOfFirstChild
      owner: user.addr, // JKL address of file owner
      isFolder: false
    }
    console.log(downloadDetails.owner)
    setActions((d: any) => ({...d, [downloadDetails.rawPath]: "DOWNLOAD"}))
    
    try {
      const tracker = { progress: 0, chunks: []}
      const file = await user.FileIO.downloadFile(user.FileIO.readActivePath() + '/' + filename, tracker)
      saveFile(file)
    } catch {
      user.addMessage({type: "ERROR", text: "Unable to download file.", timeout: 5000})
    }
    setActions((d: any) => {
      const x = {...d}
      delete x[downloadDetails.rawPath]
      return x
    })
  }

  const deleteFile = async (filename: string) => {
    console.log("[J-Suite] Deleting File:", filename)
    if (!user.FileIO) return;
    setActions((d: any) => ({...d, [dir + "/" + filename]: "DELETE"}))
    setPending(true)
    try {
      await user.FileIO.deleteTargets(filename)
    } catch {
      user.addMessage({type: "ERROR", text: "Failed to delete file.", timeout: 5000})
    }
    setActions((d: any) => {
      const x = {...d}
      delete x[dir + "/" + filename]
      return x
    })
    setPending(false)
    refresh()
  }

  const editFileMeta = async (filename: string, newTitle: string) => {
    if (filename == newTitle || !items || !user.FileIO) return true
    if (newTitle in items?.files) return 1
    
    //const readyToBroadcast = [parent.addChildDirs([newTitle]), parent.removeChildDirReferences([filename], user.wallet)]
  }

  function renderItems() {
    console.debug("[DEBUG] Rendering Items:", user.FileIO.listChildFiles())
    let elements = []
    for (const item of user.FileIO.listChildFolders()) {
      elements.push(
        <div className={'row' + (item === focus?.name ? ' focus' : '')} onClick={() => addToPath(item)}>
          <div className='select'></div>
          <div className='content'>
            <div className='column notext xsm'>
              <img className='icon' src={ico_dir}></img>
            </div>
            <div className='column xlg'>{item}</div>
            <div className='column md'></div>
            <div className='column sm'></div>
            <div className='column md'></div>
            <div className='column sm'></div>
          </div>
        </div>
      )
    }
    
    for (const [fid, item] of Object.entries<any>(user.FileIO.listChildFileMeta())) {
      //console.log(fid, item)
      let formattedDate = "Unknown"
      let date = new Date(item.lastModified)

      if (!isNaN(date.getTime())) {
        const yyyy = date.getFullYear();
        let mm: string | number = date.getMonth() + 1; // Months start at 0!
        let dd: string | number = date.getDate();
  
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        formattedDate = dd + '/' + mm + '/' + yyyy;
      }

      elements.push(
        <div className={'row' + (item.name === focus?.name ? ' focus' : '')}>
          <div className='select'></div>
          <div className='content' onClick={() => setFocus({name: item.name, size: item.size, type: item.type, date: formattedDate } as IStorageItem)}>
            <div className='column notext xsm'>
              <img className='icon' src={resolve_fileIcon(item.type)}></img>
            </div>
            <div className='column xlg'>{item.name}</div>
            <div className='column md'>{formattedDate}</div>
            <div className='column sm'>{resolve_fileSize(item.size)}</div>
            <div className='column md'>{resolve_fileSecurity(item.security)}</div>
            <div className='column sm'></div>
          </div>
        </div>
      )
    }

    if (!elements.length) {
      return (
        <div className='folderMessage'>
          This Folder is Empty
        </div>
      );
    }
    return elements
  }

  function renderLoader() {
    return (
      <div id="list-source-loading">
        <svg className="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="52" height="52" fill="#bb9219">
            <path transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
            </path>
            <path opacity="0.5" transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0.1s" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
            </path>
            <path opacity="0.25" transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0.2s" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
            </path>
        </svg>
      </div>
    )
  }

  return (
    <section className='explorer'>
      <List />
    </section>
  )
}

export default Explorer
