// Code for Navbar Component
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './navbar';
import Sidebar from './sidebar';

import './styles/css-reset.scss';
import './styles/desktop.scss';

export default function Desktop () {
    const [isSidebarEnabled, setIsSidebarEnabled] = useState(false);
    const [data, setData] = useState([]);

    function getData() {
        axios({
          method: "GET",
          url:"http://localhost:5000/data",
        })
        .then((response) => {
          const res = response.data
          setData(res.data)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })}

        // Block to call data every hour
        const MINUTE_MS = 60000;
        
        useEffect(() => {
        const interval = setInterval(() => {
            getData();
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        }, [])

    return (
        <div className="desktop">
            <Sidebar enabled={isSidebarEnabled} />
            <div className="container">
                <Navbar 
                    setIsSidebarEnabled={(newActive) => setIsSidebarEnabled(newActive)}
                    enabled={isSidebarEnabled}
                />
                <div id="test">
                   {data}
                </div>
            </div>
        </div>
    );
}