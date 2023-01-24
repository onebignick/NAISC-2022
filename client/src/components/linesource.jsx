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

  
        rangeOfDates.forEach((date)=>{
            const tmp = [];
            const url = `http://localhost:8000/getLg/${lgNewsOutlet}/${date}`;
            axios.get(url)
            .then((res) => {
                const raw_scores = res.data[0][0] != null ? res.data[0][0].split("],[").map(score => {
                    return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));

                }) : null

                if (raw_scores != null) {
                    const noOfArticles = raw_scores.length;

                    let totalHeadlineScore = 0;
                    let totalContentScore = 0;
                    raw_scores.forEach(score => {
                        totalHeadlineScore += score[0];
                        totalContentScore += score[1];
                    });
                    const avgHeadlineScore = totalHeadlineScore / noOfArticles;
                    const avgContentScore = totalContentScore / noOfArticles;
                    const clickbaitIndex = Math.abs(avgHeadlineScore - avgContentScore).toFixed(2);
                    tmp.push({
                        date: date,
                        value: clickbaitIndex,
                    })
                } else {
                    tmp.push({
                        date: date,
                        value: 0,
                    })
                }
                //console.log(tmp[0])
                setLgArticles((prev)=>{
                    return[...prev,tmp[0]]
                })

            })
            .catch((error) => {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            })
            
        });
        

    },[]);

    return (
        <>
            <h1>Trend across last 10 days</h1>
            <LineChart  width={730} height={250} data={lgArticles}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                <Line  dataKey="value"  />
                <CartesianGrid  />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart></>
       
    )

}