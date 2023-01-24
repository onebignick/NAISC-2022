import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip, FunnelChart, Funnel, LabelList } from 'recharts'

async function getSourceInfo() {
    return await axios("http://localhost:8000/getFc")
    .then(res => {
        return res.data
    })
    .catch(err => console.log(err.message))
};

export default function FunnelSource() {
    const [data, setData] = useState();

    useEffect(() => {
        getSourceInfo().then(result => {
            const tmpData = [];
            
            result.forEach(row => {
                const raw_scores = row[2].split("],[").map(score => {
                    return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));

                });
                

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
            setData(tmpData);
        });
    }, []);

    return(
        <div>
            <h2>Comparison between News Outlets Today</h2>
            <FunnelChart width={730} height={250}>
                <Tooltip />
                <Funnel
                    dataKey="value"
                    data={data}
                    isAnimationActive
                >
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
            </FunnelChart>
        </div>
        
    )
}