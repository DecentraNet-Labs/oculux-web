import { useEffect, useState } from 'react'
import ico_download from '../assets/icon-download.svg'
import ico_delete from '../assets/icon-delete.svg'
import ico_video from '../assets/icon-video.svg'
import ico_dir from '../assets/icon-directory.svg'
import ico_back from '../assets/icon-arrowBack.svg'

import { FileIo, IFolderFileFrame, IFolderChildFiles } from 'jackal.js-plus'
import Upload from './Upload'
import { resolve_videoSize } from '../utils'

const ROOT_DEFAULT = "s/Home"

interface IPropsExplorer {
  user: string
  FileIO: FileIo
  videoSelectHook: (path: string, owner: string, meta: any) => void
}

interface IStorageItems {
  directories: string[]
  files: IFolderChildFiles
}

function Explorer({ user, FileIO, videoSelectHook}: IPropsExplorer) {

  const [root, setRoot] = useState("")
  const [dir, setDir] = useState("")
  const [addr, setAddress] = useState("")
  const [items, setItems] = useState<IStorageItems>({directories: [], files: {}})

  const [uploadToggle, setUpload] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!addr)
      setAddress(user)
  }, [user])

  useEffect(() => {
    if (FileIO)
      setDir("s/Home")
  }, [FileIO])

  useEffect(() => {
    console.debug("[EXPLORER] New Directory Path: ", dir)
    async function fn() {
      if (FileIO) {
        const listFiles: IFolderFileFrame = await FileIO.downloadFolder(dir)

        const directories = listFiles.getFolderDetails().dirChildren
        const files: IFolderChildFiles = listFiles.getFolderDetails().fileChildren

        setItems({directories, files})
      } else {

      }
    }
    fn()
  }, [dir, uploadToggle, pending])

  const saveFile = (file: File) => {
    // Step 2: Convert File to Blob
    const blob = new Blob([file], { type: file.type });

    // Step 3: Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = file.name;

    // Step 4: Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
  };


  const downloadFile = async (filename: string) => {
    const downloadDetails = {
      rawPath: dir + "/" + filename, // manual complete file path OR pathOfFirstChild
      owner: addr, // JKL address of file owner
      isFolder: false
    }
    console.log(downloadDetails.owner)
    
    const fileHanlder = await FileIO.downloadFile(downloadDetails, { track: 0 })
    
    const file = fileHanlder.getFile()
    saveFile(file)
  }

  const deleteFile = async (filename: string) => {
    setPending(true)
    const parent = await FileIO.downloadFolder(dir)
    
    await FileIO.deleteTargets([filename], parent)
    setPending(false)
  }

  function renderItems() {
    let elements = []
    for (const item of items.directories) {
      elements.push(
        <div className='wrapper-row' onClick={() => setDir(dir + "/" + item)}>
          <div className='row'>
            <div className='column xsmall actions'><img className="icon" src={ico_dir} /></div>
            <div className='column xlarge'>{item}</div>
            <div className='column large'></div>
            <div className='column'></div>
            <div className='column small actions right'>
              <img className="icon" src={ico_delete} />
            </div>
          </div>
        </div>
      )
    }
    for (const [fid, item] of Object.entries<any>(items.files)) {
      console.log(fid, item)
      let date = new Date(item.lastModified)
      const yyyy = date.getFullYear();
      let mm: string | number = date.getMonth() + 1; // Months start at 0!
      let dd: string | number = date.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      const formattedDate = dd + '/' + mm + '/' + yyyy;
      elements.push(
        <div className='wrapper-row' onClick={() => videoSelectHook(dir + '/' + item.name, addr, item)}>
          <div className='row'>
            <div className='column xsmall actions'><img className="icon" src={ico_video} /></div>
            <div className='column xlarge'>{item.name}</div>
            <div className='column large'>{formattedDate}</div>
            <div className='column'>{resolve_videoSize(item.size)}</div>
            <div className='column'>{item.author}</div>
            <div className='column small actions right'>
              <img className="icon" src={ico_download} onClick={() => downloadFile(item.name)}/>
              <img className="icon" src={ico_delete} onClick={() => deleteFile(item.name)} />
            </div>
          </div>
        </div>
      )
    }
    return elements
  }

  return (
    <div id='explorer' className={'explorer container list' + (uploadToggle ? ' uploading' : '')}>
      <div className='nav'>
        <div className='path'>
          {uploadToggle ? 
          <img className='icon large action' src={ico_dir} />
          : 
          <img className='icon large action' src={ico_back} onClick={() => setDir(dir.substring(0, dir.lastIndexOf('/')))} />}
          <input className='pathInput' type='text' value={dir.replaceAll("/", " / ")} />
        </div>
        {!uploadToggle ? 
        <button className='upload' onClick={() => setUpload(true)}>
        UPLOAD
        </button>
        : null}
      </div>
      {uploadToggle ? 
        <Upload toggle={setUpload} FileIO={FileIO} dir={dir} /> 
        : 
        <>
          <div className='filelist'>
            <div className='wrapper-row'>
              <div className='header'>
                <div className='column xsmall'></div>
                <div className='column xlarge'>TITLE</div>
                <div className='column large'>DATE UPLOADED</div>
                <div className='column'>SIZE</div>
                <div className='column'>AUTHOR</div>
                <div className='column small'></div>
              </div>
            </div>
            <div className='items'>
              {renderItems()}
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default Explorer

/*
<div className='path'>
        <img className='icon large action' src={ico_back} />
        <input className='pathInput' type='text' placeholder={"JKL://oculux/videos/"} />
      </div>
      <div className='header'>
        <div className='column xsmall'></div>
        <div className='column large'>TITLE</div>
        <div className='column large'>DESCRIPTION</div>
        <div className='column right'>UPLOADED</div>
        <div className='column small'></div>
      </div>
      <div className='items'>
        <div className='wrapper-row'>
          <div className='row'>
            <div className='column xsmall actions'><img className="icon" src={ico_video} /></div>
            <div className='column large'>My First Video</div>
            <div className='column large'>The first video upload via Oculux!</div>
            <div className='column right'>12/25/2023</div>
            <div className='column small actions'>
              <img className="icon" src={ico_download} />
              <img className="icon" src={ico_delete} />
            </div>
          </div>
        </div>
        <div className='wrapper-row'>
          <div className='row'>
            <div className='column xsmall actions'><img className="icon" src={ico_video} /></div>
            <div className='column large'>My Second Videooooooooo</div>
            <div className='column large'>testing overlow</div>
            <div className='column right'>12/26/2023</div>
            <div className='column small actions'>
              <img className="icon" src={ico_download} />
              <img className="icon" src={ico_delete} />
            </div>
          </div>
        </div>
      </div>
*/