import { useState } from 'react';
import RadialSource from './radialsource';
import FunnelSource from './funnelsource';
import LineSource from './linesource';
import Checklist from './checklist';
import './styles/dashboard.scss';


export default function Dashboard(props){

    const[selectedOption,setSelectedOption]=useState("")

    const newsOutlets=["CNBC","BBC","CNN"]

    

    return(
        <div className='dashboard'>
            <div className='dashboard-part-1'>
                <RadialSource/>
                <FunnelSource/>
            </div>
            <div className='dashboard-part-2'>
                <Checklist selectedOption={selectedOption} setSelectedOption={setSelectedOption} newsOutlets={newsOutlets}/>
                <LineSource />
            </div>
        </div>
    )

}
    


    
    
    

