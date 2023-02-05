import React, { useEffect, useState } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import './styles/main.css'
import TruthLogo from './media/truth.jpg'
import Chart from "./pieChart";

function shortenString(description) {
    let words = ''

    if (description.length > 20) {
        words = description.slice(0,20) + "..."
    } else {
        words = description
    }
    return words
};
const styles = {
    maincontainer : {
        width:"100%",
        height:"100%",
        display : 'flex',
        alignItems:'center',
        paddingTop:"3em",
        paddingBottom:'3em',
        flexDirection:'column'
    },
    input:{
        width:"40%"
    },
    modal:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:"5em",
        backgroundColor:'white'
    },
    comments:{
        padding:'2em'
    }
};

function updateVotes(index, num) {
    axios({
        url: "http://localhost:8000/updateVotes",
        method: "patch",
        data: {
            article_id: index,
            num: num
        },
    })
    .then(res => {
        // console.log(res.data);
    })
    .catch(err => {
        // console.log(err.message);
    });
};
function ListItem({article, handleLink, getComments, refreshArticles}) {
    let num=((article['score']*1+article['otherscore']*1)/2).toFixed(2)
    return (
        <Card sx={{ width: 500, borderRadius:'0.5em', borderRight : num < 0 ? '1em solid #ff5d52': '1em solid #66ff70'}} raised={false} className="card">
                    <CardActionArea sx={{display:'flex', padding:'1em', justifyContent:"space-between"}}
                    onClick={()=>{handleLink(article)}}>
                        <CardMedia
                        component="img"
                        height="150"
                        style={{aspectRatio:1,maxWidth:150}}
                        image= {article['imageurl']}
                        alt="image"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {article['title']}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {shortenString(article['description'])}             
                        </Typography>
                        
                        </CardContent>
                    </CardActionArea>
                    <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            gap: '2rem',
                            margin: '0 1rem',
                        }}>
                            <ThumbUpRoundedIcon onClick={(e) => {updateVotes(article.index, 1); refreshArticles() }} />
                            <div>{article['votes']}</div>
                            <ThumbDownAltRoundedIcon onClick={() => {updateVotes(article.index, -1); refreshArticles()}} />
                            <MessageRoundedIcon onClick={() => getComments(article.index)}/>
                            <div className={num>=0?"positive":"negative"}>{num}</div>
                        </Box>
                </Card>

    )
}
function Articles({articles, handleLink, getComments, refreshArticles}){
    useEffect(()=>{},[articles])

    if (articles !== []) {
        return (
            <Box>
                {articles.map(article => ( <ListItem key={article.index} article={article} handleLink={handleLink} getComments={getComments} refreshArticles={refreshArticles} />)
                  )}
               
            </Box>
            )
        
    } else {
        return null
     }
}

export default function Main() {
    const [searchTerm, setSearchTerm] = useState("")
    const [articles, setArticles] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState({})
    const [graphContent, setGraphContent] = useState(0) 
    const [scoreRange, setScoreRange] = useState([0,0])
    const [commentInput, setCommentInput] = useState("")
    const [commentsVisible, setCommentsVisible] = useState(false)
    const [comments,setcomments] = useState([])
    const [currentArticle, setCurrentArticle] = useState('')
    //articles is array of objects
    // populate date on mount 
    const refreshArticles = () => {
        axios("http://localhost:8000/articles").then(
            res => {
                // console.log(res.data)
                setArticles(res.data)
                let highScore = -1000.0
                let lowScore = 1000.0
                let tempArray = res.data.map((item) => {
                    if (item.score > highScore) {
                        highScore = item.score
                    }
                    if (item.score < lowScore) {
                        lowScore = item.score
                    }
                    return item.score
                });
                let itemCount = tempArray.length
                let scoreSum = tempArray.reduce((sum, currentValue) => sum + currentValue, 0)
                setGraphContent((scoreSum/ itemCount).toFixed(2))
                setScoreRange([lowScore,highScore])
            }
        )
    }


    useEffect(()=> {
        //axios call here
        refreshArticles()
    },[])
    const openComments = () => {
        setCommentsVisible(true)
        // get request
    }
    const handleLink = (article) => {
        setModalContent(article)
        setModalVisible(true)
    }
    const handleKeypressComments = (e) => {
        if (e.key === "Enter") {
            // retrieve data from database (filter)
            axios.post("http://localhost:8000/comments", {comment: commentInput, article_id:currentArticle}
             ).then(
                () => {
                    getComments(currentArticle )
                }
             )
        } // post comments (need new route)

    }       

    const getComments = (id) => {
        axios.get("http://localhost:8000/getComments",
         {params :{article_id : id}, headers: {'Access-Control-Allow-Origin': '*', 
         'X-Requested-With': 'XMLHttpRequest'},}).then(
            res => {
                setcomments(res.data)
                openComments()
                setCurrentArticle(id)
            }
         )
    }
    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            // retrieve data from database (filter)
            axios.get("http://localhost:8000/search/", {params :{search : searchTerm}, headers: {'Access-Control-Allow-Origin': '*', 'X-Requested-With': 'XMLHttpRequest'},}).then(
                res => {
                    setArticles(res.data)
                    setSearchTerm('')
                }
            )
        }

    }   
    return (
        <Box style={styles.maincontainer} className='BigBox'>
            <div className='TopBox'>
                <TextField id="outlined-basic" label="Search Articles" variant="outlined" 
            value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}} 
            onKeyDown={handleKeypress}  className='input'/>
            <img className='truth' src={TruthLogo}/>
            </div>
            {/* <p style={{color: graphContent>0 ? 'green' : 'red'}}>{graphContent}</p> */}
            {articles && <Chart data={articles} />}
            <Articles articles={articles} handleLink={handleLink} 
            getComments = {getComments} refreshArticles = {refreshArticles} />
            
                    <Modal
                open={modalVisible}
                onClose={() => {setModalVisible(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modal}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {modalContent.title}
                </Typography>
                <Box
                    component="img"
                    sx={{
                    height: 233,
                    width: 350,
                    maxHeight: { xs: 233, md: 167 },
                    maxWidth: { xs: 350, md: 250 },
                    }}
                    alt=""
                    src= {modalContent.imageurl}
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {modalContent['content']}
                </Typography>
                </Box>
            </Modal>

            <Modal
                open={commentsVisible}
                onClose={() => {setCommentsVisible(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modal}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Comments
                </Typography>
                {comments.map(item =>
                    <Typography id="modal-modal-description" sx={{...styles.comment,  mt: 2 }}>
                    {item}
                </Typography> )}
                <TextField id="outlined-basic" label="Comment" variant="outlined" 
                    value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}} 
                    onKeyDown={handleKeypressComments}  className='input'/>
                </Box>
            </Modal>
        </Box>
        

    )
} 