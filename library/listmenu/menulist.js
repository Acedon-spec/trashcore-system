const chalk = require('chalk')
const fs = require('fs')
const Menu = `╭─⊷𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄─
│▢ Owner:${global.ownername}
│▢ Version: 1.2.0
│▢ Type: ${global.typebot}
╰────────────
╭─⊷🐦‍🔥MAIN-CMD─
│ • menu                    
│ • ping
│ • repo
│ • listplugin        
╰────────────
╭─⊷🗿CTRL-BOT─
│ • public                    
│ • private 
│ • getplugin 
│ • addaccess
│ • delaccess    
│ • >
│ • $
╰────────────
╭─⊷🏓MEDIA-CMD─
│ • play                     
╰────────────
╭─⊷💀BUG-CMD─
│ • trash                    
╰────────────`

module.exports = Menu
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})