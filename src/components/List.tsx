import { useEffect, useRef } from "react"

interface IPropsList {
  columns: any
  data: IListRow[]
  select: boolean
}

export interface IListColumn {
  name: string
  size: string
}

export interface IListRow {
  click?: (...args: any[]) => void;
  data: any[]
  focused?: boolean
}

export default function List({ columns, data, select }: IPropsList) {

  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const scrollableContentWrapperRef = useRef<HTMLDivElement>(null);
  
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
  }, [])

  function renderHeader() {
    const elements = []
    if (select) elements.push(<div className='select'></div>)
    for (const col of columns) {
      elements.push(
        <div key={col.name} className={'column ' + col.size}>{col.name}</div>
      )       
    }
    return elements
  }

  function renderContent() {
    const rows: JSX.Element[] = []
    for (const row of data) {
      const elements: JSX.Element[] = []
      if (select) elements.push(<div className='select'></div>)
      for (let i = 0; i < row.data.length; i++) {
        elements.push(
          <div key={columns[i].name + '-' + i} className={'column ' + (columns[i].size || '')}>{row.data[i]}</div>
        )
      }
      rows.push(
        <div key={'row-' + rows.length} className={'row' + (row.focused ? ' focus' : '')} onClick={row.click}>
          {elements}
        </div>
      )
    }
    return rows
  }

  return (
    <div className='list'>
      <div className='header' ref={headerWrapperRef}>
        <div className='row'>
          {renderHeader()}
        </div>
      </div>
      <div className='content' ref={scrollableContentWrapperRef}>
        {renderContent()}
      </div>
    </div>
  )
}