import {LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip,RadialBarChart,RadialBar,FunnelChart,Funnel,LabelList, PieChart} from 'recharts'
import { useState } from 'react';
import  axios  from 'axios';
import RadialSource from './radialsource';
import FunnelSource from './funnelsource';
import LineSource from './linesource';
import { useEffect } from 'react';
import Checklist from './checklist';

//im just gonna add some example graphs here first

//firstly, a line graph which is useful in comparing data over time, can be used to show the trend of news outlets over time
// const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 500, pv: 2500, amt: 2500},{name: 'Page C', uv: 300, pv: 2300, amt: 2300}];

// const renderLineChart = (
//   <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//     <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//     <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//     <XAxis dataKey="name" />
//     <YAxis />
//     <Tooltip />
//   </LineChart>
// )

//secondly a radial bar chart which can be useful in displaying overall mood/comparison between all the news outlets the user has been using

// const renderRadialBarChart=(
//     <RadialBarChart 
//         width={730} 
//         height={250} 
//         innerRadius="10%" 
//         outerRadius="80%" 
//         data={data} 
//         startAngle={180} 
//         endAngle={0}
// >
//         <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='uv' />
//         <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
//         <Tooltip />
//     </RadialBarChart>
// )

//Thirdly a funnel chart which can be useful in comparing single values of data, like average for different news outlets (plus it looks cool)





// example of one element in the data Array
//         article_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         article_title TEXT,
//         article_description TEXT,
//         article_url TEXT,
//         article_url_to_image TEXT,
//         article_date_published TEXT,
//         article_content TEXT,
//         article_source_id INTEGER,
//         article_author_id INTEGER,
//         article_score TEXT,
//         FOREIGN KEY (article_source_id) REFERENCES Sources(source_id),
//         FOREIGN KEY (article_author_id) REFERENCES Authors(author_id)

//create the line graph first
//  function LineGraph(props){
    
//     //lg stands for line graphs
    
//     const [lgArticles,setLgArticles]=useState([])
//     const[lgNewsOutlet,setLgNewsOutlet]=useState(1)
//     const[today,setToday]=useState(new Date())

//     //the below is assuming the reader chose this news outlet
    

//     //First do a line graph for latest 10 days for a certain news outlet
  

//     //get the 10 latest days 
    

//     useEffect(()=>{
//         const rangeOfDates=[]
//         function getDateXDaysAgo(numOfDays) {
//             const daysAgo = new Date();
//             daysAgo.setDate(daysAgo.getDate() - numOfDays);
//             let day=daysAgo.getDate()
            
//             let month=daysAgo.getMonth()+1
            
//             let year=daysAgo.getFullYear()
            
//             let formattedDate=`${year}-${month}-${day}`
          
//             return formattedDate;
//           }

//         for(let i=0;i<10;i++){
            
//             rangeOfDates.push(getDateXDaysAgo(i)) 
//         }

//         console.log(rangeOfDates)
//         rangeOfDates.map((date)=>{
//             axios({
//                 method: "GET",
//                 url:`http://localhost:8000/getLg`,
//                 params: {
//                     source: lgNewsOutlet,
//                     date: date
//                 }
//               })
//               .then((response) => {
//                 const res = response.data
//                 console.log(res)
//                 res.map((entry)=>{
                    
//                     setLgArticles((prev)=>{
//                         return [...prev,Object.assign({},entry)]
//                     })
//                 console.log(lgArticles)
//                 })
                
//             })
//               .catch((error) => {
//                 if (error.response) {
//                   console.log(error.response)
//                   console.log(error.response.status)
//                   console.log(error.response.headers)
//                   }
//               })
//         })
       
     
//     },[])
    

    
    


//     return (
//         <>
//             <h2>Trend across last 10 days</h2>
//             <LineChart  data={lgArticles} >
//             <Line  dataKey="9"  />
//             <CartesianGrid  />
//             <XAxis dataKey="5" />
//             <YAxis />
//             <Tooltip />
//             </LineChart></>
       
//     )

    
// }


// function FunnelGraph(props){

//     const[today,setToday]=useState(new Date())
//     const [fcArticles,setFcArticles]=useState([])
//     useEffect(()=>{
//         axios({
//             method: "GET",
//             url:`http://127.0.0.1:8000/getFc`
//           })
//           .then((response) => {
//             let tmpData=[]
//             response.forEach(row => {
//                 const raw_scores = row[2].split("],[").map(score => {
//                     return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));
    
//                 });
//                 console.log(raw_scores)
    
//                 const noOfArticles = raw_scores.length;
    
//                 let totalHeadlineScore = 0;
//                 let totalContentScore = 0;
//                 raw_scores.forEach(score => {
//                     totalHeadlineScore += score[0];
//                     totalContentScore += score[1];
//                 });
//                 const avgHeadlineScore = totalHeadlineScore / noOfArticles;
//                 const avgContentScore = totalContentScore / noOfArticles;
//                 const clickbaitIndex = Math.abs(avgHeadlineScore - avgContentScore).toFixed(2);
//                 tmpData.push({
//                     name: row[1],
//                     value: clickbaitIndex,
//                 })
//             })
//             setFcArticles(tmpData)
    
            
//         })
//           .catch((error) => {
//             if (error.response) {
//               console.log(error.response)
//               console.log(error.response.status)
//               console.log(error.response.headers)
//               }
//           })
//     },[])
    


//     return(
//         <>
//             <h2>Comparison between News Outlets Today</h2>
//             <FunnelChart >
//                 <Tooltip />
//                 <Funnel
//                     dataKey="value"
//                     data={fcArticles}
//                     isAnimationActive
//                 >
//                     <LabelList  dataKey="name" />
//                 </Funnel>
//             </FunnelChart>
//         </>
        
//     )
// }

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
    


    
    
    

