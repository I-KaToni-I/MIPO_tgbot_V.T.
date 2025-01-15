const fs = require('fs');


const {getInfoUser} = require("./user");

function beautifulTime(text) {
    let txt = text.split(':')
    if (txt[1].length === 1){
        return `${txt[0]}:0${txt[1]}`
    }
    return text
}

function getDay(chat_id, txt) {
    let file = fs.readFileSync("../CalendarJSON/CalendarJSON.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)
    
    let date = new Date()
    if (txt === 'сегодня') {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    } else if (txt === 'завтра') {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1)
    } else {
        txt = txt.split('.') // 14.04.4444
        date = new Date(txt[2], txt[1]-1, txt[0])
    }

    // let group = getInfoUser(chat_id, 'group')
    // Клемешов Алексей Станиславович  Екатерина Александровна  Богданчиков Сергей Александрович
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
                    arrNeedEvent.push(el) 
                }
            }
        });

    });


    let finalTxt = ''

    arrNeedEvent.forEach(el => {
        let obj = el[Object.keys(el)[0]]
        
        finalTxt += `<b>${beautifulTime(obj.dateTime[0])}-${beautifulTime(obj.dateTime[1])}</b>\n`
        finalTxt += `${obj.title}\n`
        finalTxt += `${obj.location}\n\n`
    });
    

    return finalTxt ? finalTxt : "Выходной"
}



module.exports = {getDay}