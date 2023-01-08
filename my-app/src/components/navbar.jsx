import './styles/css-reset.scss';
import './styles/navbar.scss';

export default function Navbar () {
    return(
        <div className='navbar-container'>
            <form id="search-bar-form">
                <input type="text" id="search-bar"></input>
            </form>
        </div>
    )
}