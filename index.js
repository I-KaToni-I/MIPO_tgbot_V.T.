
const fs = require('fs');
const TelegramApi = require("node-telegram-bot-api")
process.env.NTBA_FIX_350 = true;

// токен тест бота
const token = JSON.parse(fs.readFileSync("../keys.json", { encoding: 'utf8' }))['tgBotTEST']


// const token = JSON.parse(fs.readFileSync("../keys.json", { encoding: 'utf8' }))['tgBotT']



const bot = new TelegramApi(token, { polling: true })


const {saveUser, setNameT, stressSave} = require("./user");
const {getDay} = require("./brains");
const {autoTNames, KEYBOARD_TodayTomorrow} = require("./key")



async function respondText(){
    await bot.on('message', msg => {
    
        let text = msg.text.toLowerCase().replace(/ +/g, ' ').trim();
        let chat_id = msg.chat.id;
        let botText
        console.log(text)
        console.log(chat_id);
    
        try {
            if (text === "/start" || text === "/about") {
                saveUser(msg)

                botText = "Хай"
                
                return bot.sendMessage(chat_id, botText);
            }

            if (text === "/setname"){
                saveUser(msg)
          
                bot.sendMessage(chat_id, "Выберите ФИО", autoTNames());
            }

            if (text === "сегодня" || text === "завтра"){
                stressSave(chat_id)
                bot.sendMessage(chat_id, getDay(chat_id, text), { parse_mode: 'HTML' }, KEYBOARD_TodayTomorrow)
            }

            if (text.split(' ')[0] === "/getday"){
                stressSave(chat_id)
                bot.sendMessage(chat_id, getDay(chat_id, text.split(' ')[1]), { parse_mode: 'HTML' }, KEYBOARD_TodayTomorrow)
            }
            
            
        } catch (error) {
            console.log(error);
        }
    
    })
}

async function respondButton(){
    await bot.on('callback_query', msg => {
        let dataBtn = msg.data;
        let chat_id = msg.message.chat.id;


        if (dataBtn.split(', ')[0] === '3849'){
            setNameT(chat_id, dataBtn.split(', ')[1])
      
            bot.sendMessage(chat_id, "Данные сохранены", KEYBOARD_TodayTomorrow);
        }
        
    })
}


respondText()
respondButton()