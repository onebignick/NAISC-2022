import axios from "axios";

async function getSourceInfo(url) {
    return await axios(url)
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err.message);
        console.log(err.response);
        console.log(err.response.headers);
    });
};

async function cleanData(url) {
    return await getSourceInfo(url).then(result => {
            const tmpData = [];
            
            result.forEach(row => {
                const raw_scores = row[2].split("],[").map(score => {
                    return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));

                });
                
                const noOfArticles = raw_scores.length;

                let totalHeadlineScore = 0;
                let totalContentScore = 0;
                raw_scores.forEach(score => {
                    totalHeadlineScore += score[0];
                    totalContentScore += score[1];
                });
                const avgHeadlineScore = totalHeadlineScore / noOfArticles;
                const avgContentScore = totalContentScore / noOfArticles;
                const clickbaitIndex = Math.abs(avgHeadlineScore - avgContentScore).toFixed(2);
                tmpData.push({
                    name: row[1],
                    value: clickbaitIndex,
                })
            })
            return tmpData
    });
};

async function cleanDateData(url, datestr) {
    const tmp = [];
    await getSourceInfo(url).then(res => {
        const raw_scores = res[0][0] != null ? res[0][0].split("],[").map(score => {
            return score.replace(/^\[|\]$/, "").split(",").map(score => parseFloat(score));

        }) : null
        if (raw_scores != null) {
            const noOfArticles = raw_scores.length;

            let totalHeadlineScore = 0;
            let totalContentScore = 0;
            raw_scores.forEach(score => {
                totalHeadlineScore += score[0];
                totalContentScore += score[1];
            });
            const avgHeadlineScore = totalHeadlineScore / noOfArticles;
            const avgContentScore = totalContentScore / noOfArticles;
            const clickbaitIndex = Math.abs(avgHeadlineScore - avgContentScore).toFixed(2);
            tmp.push({
                date: datestr,
                value: clickbaitIndex,
            })
        } else {
            tmp.push({
                date: datestr,
                value: 0,
            })
        }
    });
    return tmp;

};


export { getSourceInfo, cleanData, cleanDateData };
