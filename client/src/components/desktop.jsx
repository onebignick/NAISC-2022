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
    //const [data, setData] = useState();

    // function getData() {
    //     console.log('Getting data...')
    //     axios({
    //       method: "GET",
    //       url:"http://127.0.0.1:8000/get-latest",
    //     })
    //     .then((response) => {
    //       const res = response.data
    //       setData(res)
    //     }).catch((error) => {
    //       if (error.response) {
    //         console.log(error.response)
    //         console.log(error.response.status)
    //         console.log(error.response.headers)
    //         }
    //     })}

    //     // Block to call data every hour (60000)
    // const MINUTE_MS = 60000;
        
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         getData()}, MINUTE_MS);

    //     return () => clearInterval(interval);
    //      // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // }, [])

    //just to check what is coming back from database
    useEffect(()=>{
        axios("http://localhost:8000/sourceInfo")
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
                <RadialSource />
                <Dashboard/>
               
                
            </div>
        </div>
    );
}