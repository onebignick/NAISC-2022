import { useState } from 'react';
import RadialSource from './radialsource';
import FunnelSource from './funnelsource';


export default function Dashboard(props){

    const[selectedOption,setSelectedOption]=useState("")

    const newsOutlets=["CNBC","BBC","CNN"]

    

    return(
        <div style={{
            backgroundColor: "white"
        }}>
        <RadialSource/>
        <FunnelSource/>
        {/* <LineSource /> */}
        </div>
    )

}
    


    
    
    

