import { useState } from 'react';
import RadialSource from './radialsource';
import FunnelSource from './funnelsource';
import LineSource from './linesource';
import Checklist from './checklist';


export default function Dashboard(props){

    const[selectedOption,setSelectedOption]=useState("")

    const newsOutlets=["CNBC","BBC","CNN"]

    

    return(
        <div style={{
            backgroundColor: "white",
            color: "green"
        }}>
        <RadialSource/>
        <FunnelSource/>
        <Checklist selectedOption={selectedOption} setSelectedOption={setSelectedOption} newsOutlets={newsOutlets}/>
        <LineSource />
        </div>
    )

}
    


    
    
    

