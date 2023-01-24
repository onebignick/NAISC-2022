import React, { useEffect, useState } from "react";
import { Tooltip, FunnelChart, Funnel, LabelList } from 'recharts';
import { cleanData } from "./functools";
import './styles/dashboard.scss';

export default function FunnelSource() {
    const [data, setData] = useState();

    useEffect(() => {
        cleanData("http://localhost:8000/getFc").then(result => setData(result));
    }, []);

    return(
        <div>
            <h1 className="fs-h1">Comparison between News Outlets Today</h1>
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