// Code for Navbar Component
import { useState } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';

import './styles/css-reset.scss';
import './styles/desktop.scss';

export default function Desktop () {
    const [isSidebarEnabled, setIsSidebarEnabled] = useState(false);

    return (
        <div className="desktop">
            <Sidebar enabled={isSidebarEnabled} />
            <div className="container">
                <Navbar 
                    setIsSidebarEnabled={(newActive) => setIsSidebarEnabled(newActive)}
                    enabled={isSidebarEnabled}
                />
                <div id="test">
                    Hello world!
                </div>
            </div>
        </div>
    );
}