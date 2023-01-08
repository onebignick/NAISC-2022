import './styles/css-reset.scss';
import './styles/sidebar.scss';

export default function Sidebar (props) {
    return( 
        <div className="sidebar-container">
            <div id="app-name" className='sidebar-button'>App Name</div>
            <div id="sidebar-links">
                <div className='sidebar-button'>Dashboard</div>
            </div>
        </div>
    )
}