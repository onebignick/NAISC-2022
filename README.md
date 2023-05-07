# news.ai
Our submission for National AI Student Challenge 2022 (NAISC2022): https://learn.aisingapore.org/national-ai-student-challenge-2022/


news.ai is a news feed that classifies each article as primarily containing positive or negative sentiments and balances the feed with a healthy mix of both. 
News feeds tend to show bias towards negative, more sensationalists articles that draw clicks and results in a saturation of negative reporting for users. news.ai aims to address this by interspersing the news feed with positive articles.

## Installation
``` bash
git clone https://github.com/onebignick/NAISC-2022
pip install -r requirements.txt
```

## Usage
### Frontend
``` bash
cd client
npm i
npm start
cd ..
```

### Backend
``` bash
cd backend
py app.py
cd ..
```

## Stack 
- React (Frontend)
- Flask (Backend)
