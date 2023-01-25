import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Legend } from 'recharts';
import FunnelSource from './funnelsource';
import LineSource from './linesource';
import Checklist from './checklist';
import './styles/dashboard.scss';


export default function Dashboard(props){

    const[selectedOption,setSelectedOption]=useState("")

    const newsOutlets=["CNBC","BBC","CNN"]

    const [data, setData] = useState();
    
    // request source data
    useEffect(()=>{
        axios("http://localhost:8000/sources")
        .then(res => {
            const tempArray = []
            for (let i=0; i<res.data.length; i++) {
                tempArray.push({
                    "name": res.data[i][1],
                    "value": res.data[i][2]
                })
            }
            setData(tempArray);
        })
        .catch(err => console.log(err.message))
    }, [])
    
    return(
        <div className='dashboard'>
            <div className='article-sources'>
                <span>Sources of our articles</span>
                <PieChart width={800} height={250}>
                    <Legend verticalAlign="top" height={36}
                        formatter={(value, entry, index) => <span className="text-color-class">{value}</span>}
                    />
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#BB86FC" label>
                    </Pie>
                </PieChart>
            </div>
            <div className="to-be-edited">
                <FunnelSource/>
            </div>
            <div className='dashboard-part-2'>
                <Checklist selectedOption={selectedOption} setSelectedOption={setSelectedOption} newsOutlets={newsOutlets}/>
                <LineSource  />
            </div>
        </div>
    )

}
    


    
    
    

