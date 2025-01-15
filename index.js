
const fs = require('fs');
const TelegramApi = require("node-telegram-bot-api")
process.env.NTBA_FIX_350 = true;

// токен тест бота
// const token = JSON.parse(fs.readFileSync("../keys.json", { encoding: 'utf8' }))['tgBotTEST']


const token = JSON.parse(fs.readFileSync("../keys.json", { encoding: 'utf8' }))['tgBotT']



const bot = new TelegramApi(token, { polling: true })


const {saveUser, setNameT, stressSave, getInfoUser} = require("./user");
const {getDay, beautifulDate} = require("./brains");
const {autoTNames, KEYBOARD_TodayTomorrow, fromAtoZ} = require("./key")





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

                botText = "⚡️Этот бот открывает вам доступ к быстрому получению расписанию для вас. \n\n🧩 Чтобы иметь возможность запрашивать расписание, вам необходимо просто указать своё ФИО при помощи команды /setname \n🌅 После чего вы сможете запросить расписание на завтра / сегодня \n\n🔄 Чтобы изменить данные о своём ФИО используйте ту же команду /setname \n\n🗓 Для получения расписания за неделю введите дату понедельника нужной недели, вместе с командой /getweek \nПример использования: /getweek 23.09.2024\n\n🎯Чтобы узнать расписание на определенный день, воспользуйтесь командой /getday\nПример использования: /getday 04.04.2024"
                
                return bot.sendMessage(chat_id, botText);
            }

            if (text === "/setname") {
                saveUser(msg)
    
                bot.sendMessage(chat_id, "Первая буква фамилии...", fromAtoZ);
            }

            if (text === "сегодня" || text === "завтра"){
                stressSave(chat_id)
                console.log(getInfoUser(chat_id, 'nameT'));
                
                bot.sendMessage(chat_id, getDay(chat_id, text), { parse_mode: 'HTML' }, KEYBOARD_TodayTomorrow)
            }

            if (text.split(' ')[0] === "/getday"){
                stressSave(chat_id)
                bot.sendMessage(chat_id, getDay(chat_id, text.split(' ')[1]), { parse_mode: 'HTML' }, KEYBOARD_TodayTomorrow)
            }
            
            if (text.split(' ')[0] === "/getweek") {

                stressSave(chat_id)

                let td = text.split(' ')[1].split('.')

                let date = new Date(Number(td[2]), Number(td[1])-1, Number(td[0]))

                let weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
                for (let el in weekdays){
                    setTimeout(function() {
                        try {
                            bot.sendMessage(chat_id, `${beautifulDate(String(date.getDate()))+'.'+beautifulDate(String(date.getMonth()+1))+'.'+date.getFullYear()} ${weekdays[el]}:\n\n` + getDay(chat_id, `${date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()}`), { parse_mode: 'HTML' }, KEYBOARD_TodayTomorrow);
                        } catch (error) {
                            console.log(error);
                        }
                        date.setDate(date.getDate() + 1)
                    }, 1000 * el);
                    
                }

    
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

        try {
            if (dataBtn.split(', ')[0] === '3849'){
                setNameT(chat_id, dataBtn.split(', ')[1])
          
                bot.sendMessage(chat_id, "Данные сохранены", KEYBOARD_TodayTomorrow);
            }
    
    
            if (msg.data.split(', ')[0] === '111000') {
                bot.sendMessage(chat_id, "Выберите своё ФИО", autoTNames('10'));
            }
        
            if (msg.data.split(', ')[0] === '000111') {
                bot.sendMessage(chat_id, "Выберите своё ФИО", autoTNames('01'));
            }
    
            if (msg.data.split(', ')[0] === '4523') {
                console.log(msg.data.split(', ')[1])
                setNameT(chat_id, msg.data.split(', ')[1])
                return bot.sendMessage(chat_id, "Данные сохранены", KEYBOARD_TodayTomorrow);
            }
            
        } catch (error) {
            console.log(error);
            
        }
        
    })
}


respondText()
respondButton()