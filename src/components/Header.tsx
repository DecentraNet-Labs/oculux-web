import logo from '../assets/logo_white.png'
import '../styles/Header.css'

export default function Header() {

  return (
    <section className='header hfl'>
      <div>
        <img src={logo} />
      </div>
    </section>
  )
}