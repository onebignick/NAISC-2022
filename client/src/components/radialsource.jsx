import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar } from "recharts";
import axios from "axios";

async function getSourceInfo() {
    return await axios("http://localhost:8000/sourceInfo")
    .then(res => {
        return res.data
    })
    .catch(err => console.log(err.message))
};

export default function RadialSource() {
    // Store source data in a state
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
                const clickbaitIndex = Math.abs(avgHeadlineScore - avgContentScore);
                tmpData.push({
                    name: row[1],
                    value: clickbaitIndex,
                })
            })
            setData(tmpData);
        });
    }, []);

    console.log(data)
    return (
        <div>
            <h1>Source Chart</h1>
            <RadialBarChart 
                width={730} 
                height={250} 
                innerRadius="10%" 
                outerRadius="80%" 
                data={data} 
                startAngle={180} 
                endAngle={0}
            >
            {/* <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='uv' />
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
            <Tooltip />  */}
            </RadialBarChart>
        </div>
    );
};