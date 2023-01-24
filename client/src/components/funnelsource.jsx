import React, { useEffect, useState } from "react";
import { Tooltip, FunnelChart, Funnel, LabelList } from 'recharts';
import { cleanData } from "./functools";

export default function FunnelSource() {
    const [data, setData] = useState();

    useEffect(() => {
        cleanData().then(result => setData(result));
    }, []);

    return(
        <div>
            <h2 style={{color: "green"}}>Comparison between News Outlets Today</h2>
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