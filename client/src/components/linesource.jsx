import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import './styles/dashboard.scss';
import { cleanDateData } from "./functools";

export default function LineSource() {
    //lg stands for line graphs
    
    const [lgArticles,setLgArticles]=useState([])
    const[lgNewsOutlet,setLgNewsOutlet]=useState("CNN")
    const[today,setToday]=useState(new Date())
    const [data, setData] = useState();

    //the below is assuming the reader chose this news outlet
    

    //First do a line graph for latest 10 days for a certain news outlet
  

    //get the 10 latest days 
    

    useEffect(()=>{
        const rangeOfDates=[]
        function getDateXDaysAgo(numOfDays) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - numOfDays);
            return daysAgo.toISOString().slice(0, 10);
        };

        for(let i=0;i<10;i++){
            rangeOfDates.push(getDateXDaysAgo(i)) 
        };

        const tmpData = [];
        rangeOfDates.forEach(async (date)=>{
            const tmp = await cleanDateData(`http://localhost:8000/getLg/${lgNewsOutlet}/${date}`, date);
            tmpData.push(tmp);
        });
        setData(tmpData);
    },[]);

    return (
        <>
            <h1>Trend across last 10 days</h1>
            <LineChart  width={730} height={250} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                <Line  dataKey="value"  />
                <CartesianGrid  />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart></>
       
    )

}