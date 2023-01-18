import './styles/css-reset.scss';
import './styles/navbar.scss';
import SearchIcon from './media/search-icon.svg';
import MenuIcon from './media/menu-icon.svg';

export default function Navbar ({setIsSidebarEnabled, enabled}) {

    return(
        <div className='navbar-container'>
            <form id="search-bar-form">
                <img id='menu-icon' src={MenuIcon} alt="#" onClick={
                    () => {
                        enabled ? setIsSidebarEnabled(false) : setIsSidebarEnabled(true)
                    }
                } />
                <div className="search-bar-com">
                    <input type="text" id="search-bar" placeholder="News article" />
                    <img id="search-icon" src={SearchIcon} alt="#" />
                </div>
            </form>
        </div>
    )
}