import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function LineSource() {
    //lg stands for line graphs
    
    const [lgArticles,setLgArticles]=useState([])
    const[lgNewsOutlet,setLgNewsOutlet]=useState("CNN")
    const[today,setToday]=useState(new Date())

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

        rangeOfDates.forEach((date)=>{
            const url = `http://localhost:8000/getLg/${lgNewsOutlet}/${date}`;
            axios.get(url)
            .then((res) => {
                const raw_scores = res.data[0][0] != null ? res.data[0][0].split("],[").map(score => {
                    return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));

                }) : null
                console.log(date)
                console.log(raw_scores)
            })
            .catch((error) => {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            })
        });

    },[])
    

    
    


    return (
        <>
            <h2>Trend across last 10 days</h2>
            <LineChart  data={lgArticles} >
                <Line  dataKey="9"  />
                <CartesianGrid  />
                <XAxis dataKey="5" />
                <YAxis />
                <Tooltip />
            </LineChart></>
       
    )

}