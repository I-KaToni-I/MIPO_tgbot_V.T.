const fs = require('fs');


const {getInfoUser} = require("./user");

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}


function beautifulTime(text) {
    let txt = text.split(':')
    if (txt[1].length === 1){
        return `${txt[0]}:0${txt[1]}`
    }
    return text
}

function beautifulDate(text) {
    if (text.length === 1){
        return "0"+text
    }
    return text
}



function getDay(chat_id, txt) {
    let file = fs.readFileSync("../CalendarJSON/CalendarJSON.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)
    
    let date = new Date().addHours(3)
    if (txt === 'сегодня') {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    } else if (txt === 'завтра') {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1)
    } else {
        txt = txt.split('.') // 14.04.4444
        date = new Date(txt[2], txt[1]-1, txt[0])
    }

    let nameT = getInfoUser(chat_id, 'nameT')

    let arrNeedEvent = []

    Object.keys(JN).forEach(group => {
        
        JN[group].forEach(el => {
    
            
            let arrEvent = Object.keys(el)[0].split(',')
            let arrStartEvent = arrEvent[0].split('.')
            let arrEndEvent = arrEvent[1].split('.')
            
            let startEvent = new Date(arrStartEvent[2], arrStartEvent[1]-1, arrStartEvent[0])
            let endEvent = new Date(arrEndEvent[2], arrEndEvent[1]-1, arrEndEvent[0])
    
    
            if (+date >= +startEvent && +date <= +endEvent) {                
                if (el[Object.keys(el)[0]].location.includes(nameT)) {

                    el[Object.keys(el)[0]]['group'] = group
                    
                    arrNeedEvent.push(el) 
                }
            }
        });

    });


    let finalTxt = ''

    console.log(arrNeedEvent);
    

    arrNeedEvent.forEach(el => {
        let obj = el[Object.keys(el)[0]]


        if (!finalTxt.includes(beautifulTime(obj.dateTime[0]))) {
            finalTxt += `\n\n<b>${beautifulTime(obj.dateTime[0])}-${beautifulTime(obj.dateTime[1])}</b>\n`
        } else {
            finalTxt += `--И--\n`
            
        }
        finalTxt += `Группа: ${obj.group}\n`
        finalTxt += `${obj.title}\n`
        finalTxt += `${obj.location.split('-')[0]}\n`

        
    });
    

    return finalTxt ? finalTxt : "Выходной"
}



module.exports = {getDay, beautifulDate}