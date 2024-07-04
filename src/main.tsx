import ReactDOM from 'react-dom/client'
import Oculux from './Oculux.tsx'
import './index.css'
import { AppProvider } from './AppContext.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <Oculux />
  </AppProvider>
)