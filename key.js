const fs = require('fs');


const KEYBOARD_TodayTomorrow = {
    reply_markup: JSON.stringify({
        "keyboard": [
            [{ "text": "Сегодня" },],
            [{ "text": "Завтра" },],
        ],
        "resize_keyboard": true,
        "one_time_keyboard": true,
    })
};

const fromAtoZ = {
    reply_markup: JSON.stringify({
    "inline_keyboard": [
        [{ "text": "от А до К", 'callback_data': '111000' }, { "text": "от Л до Я", 'callback_data': '000111' }],
    ]
})
};


function autoTNames(str) {
    let ArrName = JSON.parse(fs.readFileSync("./tNames.json", { encoding: 'utf8' }))
    names_arr = ArrName[str]

    let keyB = {
        
        "inline_keyboard": [

        ]
    };

    let coc = 3
    let caunt = -1
    names_arr.forEach(el => {
        if (el != '') {
            el = el.split(' ')[0]+" "+el.split(' ')[1]
            if (coc === 3) {
                coc = 1
                caunt += 1
                keyB.inline_keyboard.push([])
            }

            keyB.inline_keyboard[caunt].push({ "text": el, 'callback_data': '4523, ' + el })

            coc += 1
        }
    })


    keyB = {
        reply_markup: `{"inline_keyboard":${JSON.stringify(keyB.inline_keyboard)}}`

    }


    return keyB
}



module.exports = {autoTNames, KEYBOARD_TodayTomorrow, fromAtoZ}