import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function LineSource() {
    //lg stands for line graphs
    
    const [lgArticles,setLgArticles]=useState([])
    const[lgNewsOutlet,setLgNewsOutlet]=useState("CNN")
    const[today,setToday]=useState(new Date())

    //the below is assuming the reader chose this news outlet
    

    //First do a line graph for latest 10 days for a certain news outlet
  

    //get the 10 latest days 
    

    useEffect(()=>{
        const rangeOfDates=[]
        function getDateXDaysAgo(numOfDays) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - numOfDays);
            let day=daysAgo.getDate()
            
            let month=daysAgo.getMonth()+1
            
            let year=daysAgo.getFullYear()
            
            let formattedDate=`${year}-${month}-${day}`
          
            return formattedDate;
          }

        for(let i=0;i<10;i++){
            
            rangeOfDates.push(getDateXDaysAgo(i)) 
        }

        console.log(rangeOfDates)
        rangeOfDates.map((date)=>{
            axios({
                method: "GET",
                url:`http://localhost:8000/getLg`,
                params: {
                    source: lgNewsOutlet,
                    date: date
                }
              })
              .then((response) => {
                const res = response.data
                console.log(res)
                res.map((entry)=>{
                    
                    setLgArticles((prev)=>{
                        return [...prev,Object.assign({},entry)]
                    })
                console.log(lgArticles)
                })
                
            })
              .catch((error) => {
                if (error.response) {
                  console.log(error.response)
                  console.log(error.response.status)
                  console.log(error.response.headers)
                  }
              })
        })
       
     
    },[])
    

    
    


    return (
        <>
            <h2>Trend across last 10 days</h2>
            <LineChart  data={lgArticles} >
                <Line  dataKey="9"  />
                <CartesianGrid  />
                <XAxis dataKey="5" />
                <YAxis />
                <Tooltip />
            </LineChart></>
       
    )

}