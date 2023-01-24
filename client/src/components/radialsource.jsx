import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Legend, Tooltip } from "recharts";
import { cleanData } from "./functools";
import './styles/dashboard.scss';

export default function RadialSource() {
    // Store source data in a state
    const [data, setData] = useState();

    useEffect(() => {
        cleanData("http://localhost:8000/sourceInfo").then(result => {
            console.log(result)
            setData(result)
        });
    }, []);

    return (
        <div>
            <h1>Sources of our articles</h1>
            <RadialBarChart 
                width={500} 
                height={500} 
                innerRadius="50%" 
                outerRadius="100%" 
                data={data}
                cx="50%"
                cy="50%"
            >
            <PolarAngleAxis
                type="number"
                domain={[0, 2]}
                dataKey={'value'}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey={'value'} />
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
            </RadialBarChart>
        </div>
    );
};