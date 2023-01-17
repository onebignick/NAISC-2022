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
