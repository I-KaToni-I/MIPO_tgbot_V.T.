const fs = require('fs');



function saveUser(msg) {
    let file = fs.readFileSync("../SAVES/teacher.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)
    let chatID = msg.chat.id

    try {
        let first_name = msg.chat.first_name
        let last_name = msg.chat.last_name
        let username = msg.chat.username
        JN[chatID]["first_name"] = first_name
        JN[chatID]["last_name"] = last_name
        JN[chatID]["username"] = username
    } catch (err) {
        try {
            JN[chatID] = {
                "nameT": JN[chatID]["nameT"],
                "usageCounter": JN[chatID]["usageCounter"],
                "lastUse": JN[chatID]["lastUse"]
            }
        } catch (err) {
            JN[chatID] = {
                "nameT": "",
                "usageCounter": 0,
                "lastUse": ""
            }
        }
    }

    fs.writeFileSync("../SAVES/teacher.json", JSON.stringify(JN))
}



function setNameT(chat_id, nameT) {
    let file = fs.readFileSync("../SAVES/teacher.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)

    JN[chat_id]["nameT"] = nameT
    fs.writeFileSync("../SAVES/teacher.json", JSON.stringify(JN))
}



function getInfoUser(chat_id, info) {
    let file = fs.readFileSync("../SAVES/teacher.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)


    return JN[chat_id][info]
}



function stressSave(ID) {
    let file = fs.readFileSync("../SAVES/teacher.json", { encoding: 'utf8' })
    let JN = JSON.parse(file)
    if ("usageCounter" in JN[ID]) {
        if (typeof JN[ID]["usageCounter"] == 'string') {
            JN[ID]["usageCounter"] = 1
        } else {
            JN[ID]["usageCounter"] = JN[ID]["usageCounter"] + 1
        }
        JN[ID]["lastUse"] = new Date()
        
    } else {
        JN[ID]["usageCounter"] = 1
        JN[ID]["lastUse"] = new Date()
    }
    fs.writeFileSync("../SAVES/teacher.json", JSON.stringify(JN))
}



module.exports = {saveUser, setNameT, getInfoUser, stressSave}