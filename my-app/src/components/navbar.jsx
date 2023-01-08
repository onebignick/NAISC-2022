import './styles/css-reset.scss';
import './styles/navbar.scss';
import SearchIcon from './media/search-icon.svg';
import MenuIcon from './media/menu-icon.svg';

export default function Navbar ({setIsSidebarEnabled}) {

    return(
        <div className='navbar-container'>
            <form id="search-bar-form">
                <img id='menu-icon' src={MenuIcon} alt="#" onClick={
                    () => setIsSidebarEnabled(true)
                } />
                <input type="text" id="search-bar" />
                <img id="search-icon" src={SearchIcon} alt="#" />
            </form>
        </div>
    )
}