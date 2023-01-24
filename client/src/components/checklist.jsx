import React, { useState } from "react";
import { useEffect } from "react";
import './styles/dashboard.scss';

export default function Checklist(props){
    let {selectedOption}=props
    let {newsOutlets}=props
    let {setSelectedOption}=props
    function handleClick(event){
        setSelectedOption(event.target.value)

    }

  

    return(
        <form>
            <h1>News Outlets</h1>
            {newsOutlets.map((entry)=>{
                return(
                    <div>
                    <label for={`${entry}`} >{`${entry}`}</label>
                    <input type="radio" id={`${entry}`} name="newsOutlet" value={`${entry}`}  onClick={handleClick} checked={selectedOption===`${entry}`}/>
                    </div>
                )
            })}

        </form>
    )

    
  
}
