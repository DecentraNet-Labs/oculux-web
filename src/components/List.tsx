import { useEffect, useRef } from "react"

interface IPropsList {
  columns: any
  data: IListRow[]
  select: boolean
  status: ListStatus
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

export enum ListStatus {
  ACTIVE,
  LOADING,
  ERROR
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
    if (select) elements.push(
      <div className='select'>
        <label className="container">
          <input type="checkbox" />
          <span className="checkmark"></span>
        </label>
      </div>
    )
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
      if (select) elements.push(
        <div className='select'>
          <label className="container">
            <input type="checkbox" />
            <span className="checkmark"></span>
          </label>
        </div>
      )
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