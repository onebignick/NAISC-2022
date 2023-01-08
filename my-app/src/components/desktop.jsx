// Code for Navbar Component
import Navbar from './navbar';
import Sidebar from './sidebar';

import './styles/css-reset.scss';
import './styles/desktop.scss';

export default function Desktop () {
    return (
        <div className="desktop">
            <Sidebar/>
            <div className="container">
                <Navbar/>
            </div>
        </div>
    );
}