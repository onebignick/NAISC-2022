import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip, FunnelChart, Funnel, LabelList } from 'recharts'

export default function FunnelSource() {
    const[today,setToday]=useState(new Date())
    const [fcArticles,setFcArticles]=useState([])
    useEffect(()=>{
        axios({
            method: "GET",
            url:`http://127.0.0.1:8000/getFc`
          })
          .then((response) => {
            let tmpData=[]
            response.forEach(row => {
                const raw_scores = row[2].split("],[").map(score => {
                    return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));
    
                });
                console.log(raw_scores)
    
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
                tmpData.push({
                    name: row[1],
                    value: clickbaitIndex,
                })
            })
            setFcArticles(tmpData)
    
            
        })
          .catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              }
          })
    },[])
    


    return(
        <div>
            <h2>Comparison between News Outlets Today</h2>
            <FunnelChart >
                <Tooltip />
                <Funnel
                    dataKey="value"
                    data={fcArticles}
                    isAnimationActive
                >
                    <LabelList  dataKey="name" />
                </Funnel>
            </FunnelChart>
        </div>
        
    )
}