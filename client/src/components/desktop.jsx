// Code for Navbar Component
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './navbar';
import Sidebar from './sidebar';
import RadialSource from './radialsource';
import Dashboard from './dashboard';


import './styles/css-reset.scss';
import './styles/desktop.scss';

export default function Desktop () {
    const [isSidebarEnabled, setIsSidebarEnabled] = useState(false);
    
    useEffect(()=>{
        axios("http://localhost:8000/articles")
        .then(res => {
            console.log(res.data)
            
        })
        .catch(err => console.log(err.message))
    })
    

    return (
        <div className="desktop">
            <Sidebar enabled={isSidebarEnabled} />
            <div className="container" onClick={() => {
                if (isSidebarEnabled) setIsSidebarEnabled(false)
            }}>
                <Navbar 
                    setIsSidebarEnabled={(newActive) => setIsSidebarEnabled(newActive)}
                    enabled={isSidebarEnabled}
                />
                {/* <div id="test">
                   {data}
                </div> */}
                
                <Dashboard/>
               
                
            </div>
        </div>
    );
}