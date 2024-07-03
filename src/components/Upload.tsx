

import { useEffect, useState, DragEvent } from 'react'
import ico_download from '../assets/icon-download.svg'
import ico_delete from '../assets/icon-delete.svg'
import ico_video from '../assets/icon-video.svg'
import ico_dir from '../assets/icon-directory.svg'
import ico_close from '../assets/icon-close.svg'

import { FileIo, FileUploadHandler, IFolderChildFiles, IUploadList } from 'jackal.js-plus'

import '../styles/upload.css'
import IExtendedMetadata from '../interfaces/IExtendedMetadata'
import { getVideoFileMetadata, getVideoLength } from '../utils'
import IVideoFileMetadata from '../interfaces/IVideoFileMetadata'

const ROOT_DEFAULT = "s/Home"

interface IPropsUpload {
  toggle: (t: boolean) => void
  dir: string
  FileIO: FileIo
}

interface IStorageItems {
  directories: string[]
  files: IFolderChildFiles
}

interface IFileData {
  file: File,
  security: number
  title: string
  description?: string
  author?: string
  legacyFile?: boolean
}

interface IFiles {
  [k: string]: IFileData
}

function Upload({ toggle, FileIO, dir }: IPropsUpload) {

  const [root, setRoot] = useState("")
  

  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<IFiles>({})
  const [advancedToggle, setAdvanced] = useState<string[]>([]);

  useEffect(() => {
    return;
  }, [items]) 

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    // Access the dropped files using e.dataTransfer.files
    const droppedFiles = e.dataTransfer.files;
    console.log('Dropped files:', droppedFiles);
    processFiles([...droppedFiles])
    // Perform additional logic with the dropped files
  };

  function processFiles(files: File[]) {
    setItems((prevItems) => {
      const newFiles: IFiles = { ...prevItems };
  
      for (const file of files) {
        const filename = file.name;
        newFiles[filename] = {
          file,
          security: 1,
          title: filename,
        };
      }
  
      return newFiles;
    });
  }

  function removeFile(filename: string) {
    setItems((prevItems) => {
      const newFiles: IFiles = { ...prevItems };
      delete newFiles[filename]
      return newFiles;
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFiles = Array.from(fileInput.files || []);
  
    // Process the selected files
    processFiles(selectedFiles);
  
    // Clear the input by resetting its value
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLSelectElement>, filename: string) => {
    const selectedSecurity = parseInt(e.target.value, 10);

    setItems((prevItems) => {
      // Create a new object to update the state
      const newItems = { ...prevItems };
      newItems[filename] = {
        ...newItems[filename],
        security: selectedSecurity,
      };
  
      return newItems;
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    setItems((prevItems) => {
      // Create a new object to update the state
      const itemsUpdated = { ...prevItems };
      itemsUpdated[filename] = {
        ...itemsUpdated[filename],
        title: e.target.value
      };
      return itemsUpdated;
    });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    setItems((prevItems) => {
      // Create a new object to update the state
      const itemsUpdated = { ...prevItems };
      itemsUpdated[filename] = {
        ...itemsUpdated[filename],
        author: e.target.value
      };
      return itemsUpdated;
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, filename: string) => {
    setItems((prevItems) => {
      // Create a new object to update the state
      const itemsUpdated = { ...prevItems };
      itemsUpdated[filename] = {
        ...itemsUpdated[filename],
        description: e.target.value
      };
      return itemsUpdated;
    });
  };

  const handleLegacyChange = (e: React.ChangeEvent<HTMLInputElement>, filename: string) => {
    setItems((prevItems) => {
      // Create a new object to update the state
      const itemsUpdated = { ...prevItems };
      itemsUpdated[filename] = {
        ...itemsUpdated[filename],
        legacyFile: e.target.checked
      };
      return itemsUpdated;
    });
  };

  const toggleAdvancedMenu = (filename: string) => {
    setAdvanced((prevItems) => {
      // Create a new object to update the state
      if (prevItems.includes(filename)) {
        return prevItems.filter((item: string) => item != filename)
      } else {
        return [ filename, ...prevItems ]
      }
    });
  }

  const cancelUpload = () => {
    toggle(false)
  }

  const doUpload = async () => {
    const time = new Date().getTime()
    const uploadList: IUploadList = {}
    const parent = await FileIO.downloadFolder(dir)
    //console.log(parent,dir)
    for (const item of Object.values(items)) {
      const handler = await FileUploadHandler.trackFile(item.file, item.security, dir)
      const videoMeta: IVideoFileMetadata = await getVideoFileMetadata(item.file)
      const extendedMeta: IExtendedMetadata = {
        title: item.title,
        description: item.description || "",
        author: item.author || "",
        legacyFile: item.legacyFile || false,
        firstUpload: time,
        lastUpload: time,
        videoLength: videoMeta.duration,
        videoResolution: videoMeta.width + "x" + videoMeta.height
      }
      console.log("METADATA:", extendedMeta)

      handler.addMeta(extendedMeta)
      uploadList[item.file.name] = {
        data: null,
        exists: false,    // [TODO]: file update
        handler: handler,
        key: item.file.name,
        uploadable: item.legacyFile ? await handler.getForLegacyUpload() : await handler.getForUpload()
      }
    }
    await FileIO.staggeredUploadFiles(uploadList, parent, {counter: 0, complete: 0})
    toggle(false)
  }

  function renderItems() {
    let elements: JSX.Element[] = []
    for (const item of Object.values(items)) {
      elements.push(
        <div className='file' key={item.file.name}>
          <div className='main'>
            <div className='content'>
              <div className='title'>{item.title}</div>
              <div className='subtitle'>[FILE] {item.file.name} &nbsp; | &nbsp; [SIZE] {item.file.size / 1000 + " KB"}</div>
              <div className='menu'>
                <div className='select'>
                  <div>Security</div>
                  <select value={item.security} onChange={(e) => handleSecurityChange(e, item.file.name)}>
                    <option key={0} value={0}>Public</option>
                    <option key={1} value={1}>Private</option>
                    <option key={2} value={2} disabled>Protected</option>
                  </select>
                </div>
                <div className='textbutton'  onClick={() => toggleAdvancedMenu(item.file.name)} >
                  ADVANCED OPTIONS
                </div>
              </div>
            </div>
            <div className='actions'>
              <img className='icon' src={ico_close} onClick={() => removeFile(item.file.name)} />
            </div>
          </div>
          <div className={advancedToggle.includes(item.file.name) ? 'advanced open' : 'advanced'}>
            <div className='row title'>
              Extended Metadata
            </div>
            <div className='row'>
              <div className='half'>
                <span>Title</span>
                <input value={item.title} onChange={(e) => handleTitleChange(e, item.file.name)} className='text'></input>
              </div>
              <div className='half'>
                <span>Author</span>
                <input className='text' onChange={(e) => handleAuthorChange(e, item.file.name)}></input>
              </div>
            </div>
            <div className='row'>
              <div className='full'>
                <span>Description</span>
                <textarea className='text' onChange={(e) => handleDescriptionChange(e, item.file.name)}></textarea>
              </div>
            </div>
            <div className='row title'>
              Advanced Configuration
            </div>
            <div className='row'>
              <div className='row full'>
                <input type='checkbox' onChange={(e) => handleLegacyChange(e, item.file.name)}/>
                <span>Legacy Compatibility</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return elements
  }

  return (
    <div onDragOver={handleDragOver} id='view_upload' className='view_upload'>
      <div onDragLeave={handleDragLeave} onDrop={handleDrop} id='dropbox' className={`dropbox${isDragging ? ' visible' : ''}`}>
        <div>Drag & Drop File(s)</div>
      </div>
      {renderItems()}
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default file input UI
        multiple
      />
      <label htmlFor="fileInput"></label>
      <button onClick={() => document.getElementById('fileInput').click()}>Choose File(s)</button>
      <div className='actions'>
        <button className='red' onClick={() => cancelUpload()}>CANCEL</button>
        <button className='green' onClick={() => doUpload()}>UPLOAD</button>
      </div>
    </div>
  )
}

export default Upload