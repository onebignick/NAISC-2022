import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip } from 'recharts';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function Chart(props) {
    
    const [data, setData] = useState([
        {name: "Neutral", score: 0, fill: "#187498"},
        {name: "Positive", score: 0, fill: "#36AE7C"},
        {name: "Negative", score: 0, fill: "#EB5353"}
    ]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (props.data) {
            props.data.forEach(article => {
                const score = (article.score + article.otherscore) / 2;
                if (score === 0) {
                    setData(prevData => {
                        const newData = prevData;
                        newData[0].score++;
                        return newData;
                    });
                } else if (score > 0) {
                    setData(prevData => {
                        const newData = prevData;
                        newData[1].score++;
                        return newData;
                    });
                } else {
                    setData(prevData => {
                        const newData = prevData;
                        newData[2].score++;
                        return newData;
                    });
                }
            })
            setTimeout(() => {
                setIsReady(true);
            }, 500)
            
        }
    }, [props.data])

    return (
        <div>
            {isReady ?
            <div style={{textAlign: "center"}}>
            <h3>Overview of news sentiment</h3>
                <PieChart width={350} height={350}>
                    <Pie data={data} dataKey="score" cx="50%" cy="50%" fill="fill" />
                    <Tooltip />
                </PieChart>
            </div> : <HourglassEmptyIcon size={100} />}
        </div>
    );
};