import {LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip,RadialBarChart,RadialBar,FunnelChart,Funnel} from 'recharts'

//im just gonna add some example graphs here first

//firstly, a line graph which is useful in comparing data over time, can be used to show the trend of news outlets over time
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 500, pv: 2500, amt: 2500},{name: 'Page C', uv: 300, pv: 2300, amt: 2300}];

const renderLineChart = (
  <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LineChart>
)

//secondly a radial bar chart which can be useful in displaying overall mood/comparison between all the news outlets the user has been using

const renderRadialBarChart=(
    <RadialBarChart 
        width={730} 
        height={250} 
        innerRadius="10%" 
        outerRadius="80%" 
        data={data} 
        startAngle={180} 
        endAngle={0}
>
        <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='uv' />
        <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
        <Tooltip />
    </RadialBarChart>
)

//Thirdly a funnel chart which can be useful in comparing single values of data, like average for different news outlets (plus it looks cool)

const renderFunnelChart=(
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
)


// example of one element in the data Array
// {
//     "source": {"id": null,"name": "CNBC"},
//     "author": "Diana Olick",
//     "title": "Mortgage demand jumps nearly 28% in one week, as interest rates drop to lowest point in months - CNBC",
//     "description": "Mortgage rates are at the lowest level since September, and that is bringing new demand into the mortgage market.",
//     "url": "https://www.cnbc.com/2023/01/18/mortgage-demand-jumps-interest-rates-drop.html",
//     "urlToImage": "https://image.cnbcfm.com/api/v1/image/107100450-1659971734911-gettyimages-1347125073-120_0821_125790.jpeg?v=1674043202&w=1920&h=1080",
//     "publishedAt": "2023-01-18T12:00:02Z",
//     "content": "Consumers returned from the holiday season to find mortgage rates at their lowest point since September, and they are responding in dramatic fashion.\r\nMortgage application volume jumped nearly 28% la… [+1472 chars]"
//     },
export default function Charts(props){
    const {data}=props
    //First do a line graph for latest 10 days for a certain news outlet
    const fullCurrentDate= new Date()
    let day = fullCurrentDate.getDate();
    let month = fullCurrentDate.getMonth() + 1;
    let year = fullCurrentDate.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate); // "17-6-2022"
}
