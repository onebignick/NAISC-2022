import React, { useEffect, useState } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

function shortenString(description) {
    let words = ''

    if (description.length > 20) {
        words = description.slice(0,20) + "..."
    } else {
        words = description
    }
    return words
}
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
    }
}
function ListItem({article, handleLink}) {
    return (
        <Card sx={{ width: 500, borderRadius:'0.5em', borderRight : article['score'] < 0 ? '1px solid #ff5d52': '1px solid #66ff70'}} raised={false}>
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
                </Card>

    )
}
function Articles({articles, handleLink}){
    useEffect(()=>{},[articles])

    if (articles !== []) {
        return (
            <Box>
                {articles.map(article => ( <ListItem article={article} handleLink={handleLink} />)
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
    //articles is array of objects
    // populate date on mount 
    useEffect(()=> {
        //axios call here
        axios("http://localhost:8000/articles").then(
            res => {
                console.log(res.data)
                setArticles(res.data)
            }
        )
    },[])
    const handleLink = (article) => {
        setModalContent(article)
        setModalVisible(true)
    }
    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            // retrieve data from database (filter)
            axios.get("http://localhost:8000/articles", {params :{search : searchTerm}}).then(
                res => {
                    setArticles(res.data)
                    setSearchTerm('')
                }
            )
        }

    }   
    return (
        <Box style={styles.maincontainer}>
            <TextField id="outlined-basic" label="Search Articles" variant="outlined" 
            value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}} 
            onKeyDown={handleKeypress} style={styles.input}/>
            <p>graph here</p>
            <Articles articles={articles} handleLink={handleLink}/>
            
                    <Modal
                open={modalVisible}
                onClose={() => {setModalVisible(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modal}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    modalContent.title
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
                    modalContent['content']
                </Typography>
                </Box>
            </Modal>
        </Box>
        

    )
} 