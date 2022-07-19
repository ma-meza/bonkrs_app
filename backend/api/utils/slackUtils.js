const axios = require("axios");
const slackUrl = 'https://slack.com/api/chat.postMessage';

exports.sendErrorLog = (errorMessage)=>{
    if(process.env.NODE_ENV.trim() != "development"){
        axios.post(slackUrl, {
            channel: '#server-problems',
            text: errorMessage
        }, { headers: { authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } });
        return;
    }else{
        console.log(errorMessage);
        return;
    }
};


exports.newProductsRecommendation = (itemName) =>{
    axios.post(slackUrl, {
        channel: '#product-recommendations',
        text: itemName
    }, { headers: { authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } });
}

exports.cheerWaitlist = (emailBody) =>{
    axios.post(slackUrl, {
        channel: '#waitlist',
        text: emailBody + " just signed up to the waitlist! Congrats!"
    }, { headers: { authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } });
}