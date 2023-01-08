import './styles/css-reset.scss';
import './styles/navbar.scss';
import SearchIcon from './media/search-icon.svg'
export default function Navbar () {
    return(
        <div className='navbar-container'>
            <form id="search-bar-form">
                <input type="text" id="search-bar"></input>
            </form>
            <img src={SearchIcon}></img>
        </div>
    )
}