require('dotenv').config();
const lineNotify = (data) => {
    const lineNotify = require(`line-notify-nodejs`)(process.env.LINE_TOKEN)
    lineNotify.notify({
        message: data,
    }).then(() => {
        console.log(`line send completed : ${data}`);
        return data
    });
}

module.exports = lineNotify