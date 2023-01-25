import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProgressChart (props) {
    const [data, setData] = useState([])
 // request latest article
    useEffect(()=>{
        axios("http://localhost:8000/get-latest")
        .then(res => {
            console.log(res.data)
            const latest_scores = res.data[res.data.length-1].slice(1,-1).split(',')
        })
        .catch(err => console.log(err.message))
    }, [])

    const circleSize = 30;

    return (
        <div>
            <RadialBarChart
            width={circleSize}
            height={circleSize}
            cx={circleSize / 2}
            cy={circleSize / 2}
            innerRadius={12}
            outerRadius={18}
            barSize={2}
            data={data}
            startAngle={90}
            endAngle={-270}
            >
            <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
            />
            <RadialBar
            background
            clockWise
            dataKey="value"
            cornerRadius={circleSize / 2}
            fill="#82ca9d"
            />
            <text
            x={circleSize / 2}
            y={circleSize / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="progress-label"
            >
            25
            </text>
            </RadialBarChart>
        </div>
    );
}