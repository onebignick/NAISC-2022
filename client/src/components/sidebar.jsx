import './styles/css-reset.scss';
import './styles/sidebar.scss';

export default function Sidebar (props) {
    // if (props.enabled === false) {
    //     return ('');
    // } else {
    return( 
        <div className="sidebar-container" style={{
            transform: props.enabled ? "translateX(0)" : "translateX(-250px)"
        }}>
            <div id="app-name" className='sidebar-button'>&#128240;news.ai</div>
            <div id="sidebar-links">
                <div className='sidebar-button'>Dashboard</div>
            </div>
        </div>
    )
    // };
}

// transform: navDisplay ? "translateX(0)" : "translateX(-20rem)"

