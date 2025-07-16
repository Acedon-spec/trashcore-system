require('./trashenv')

const {
    default: makeWAsocket,
    useMultiFileAuthState,
    DisconnectReason,delay,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    getAggregateVotesInPollMessage,
    makeCacheableSignalKeyStore,
    Browsers,
    MessageRetryMap
} = require("@whiskeysockets/baileys");
const pino = require('pino')
const chalk = require('chalk')
const { exec } = require('child_process')
const { Boom } = require('@hapi/boom');
const readline = require('readline');
const path = require('path')
const cfonts = require('cfonts');
const fs = require('fs')
const _ = require('lodash');
const yargs = require('yargs/yargs');
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./library/lib/function.js')
const connectpic = fs.readFileSync('./library/media/connect.jpg');
const listcolor = ['cyan', 'magenta', 'green', 'yellow', 'blue'];
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)];
const { color, bgcolor } = require('./library/lib/color.js');
const { imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = require('./library/lib/exif');
const FileType = require('file-type');
let low;
try {
    low = require('lowdb');
} catch (e) {
    low = require('./library/lib/lowdb');
};
const {
    Low,
    JSONFile
} = low;
const mongoDB = require('./library/lib/mongoDB');

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    });
    return new Promise((resolve) => { rl.question(text, resolve) });
}

const idch = "120363257205745956@newsletter";
const start = async() => {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
cfonts.say('HOLLA', 
{
    font: 'block',
    align: 'left',
    colors: ['#ff00ff', 'white'],
    background: 'transparent',
    rawMode: false,
});
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState(`./${global.session}`)
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion();
const welcomeMessage = `
[[ ༑📚𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚 𝑻𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆 ⿻ ༑]]
┏─•⛩️ ${global.botname} ⛩️•─⬣[⿻

👋 Hii, I Am ${global.botname}
 [⿻] 🌌 Version      : 1.2.0
 [⿻] 👤 Owner  	     : ${global.owner}
 [⿻] 📚 Library      : WBaileys MD
 [⿻] 📱 Status       : Online
 [⿻] 📝 Session     :  ${global.session}
 
 [⿻] 🌎 Base By    : trashcoredevs

┗─•${global.botname}•─⬣[⿻
[[ ༑📚𝑪𝒓𝒆𝒂𝒕𝒆 𝑩𝒚 𝒕𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆༢⿻ ༑]]
`;
    console.log(welcomeMessage);       
	const trashcore = await makeWAsocket({
	    //agent,
        keepAliveIntervalMs: 10000,
        printQRInTerminal: !global.connect,
        logger: pino({
            level: "silent"
        }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
        },
        browser: ["Ubuntu", "Chrome", "20.0.00"],
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        maxMsgRetryCount: 15,
        retryRequestDelayMs: 10,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        MessageRetryMap,
        resolveMsgBuffer: true,
        emitOwnEvents: true,
        fireInitQueries: true,
        markOnlineOnConnect: false,
	})

        if (global.connect && !trashcore.authState.creds.registered) {
        try {
            const phoneNumber = await question(chalk.cyan(`\n[ ᯤ ] Trashcore (--||--) Enter Your Number:\n`));
            const code = await trashcore.requestPairingCode(phoneNumber.trim());
            console.log(chalk.green(`\n[ ᯤ ] trashcore (--||--) Pairing Code:\n`), code);
        } catch (error) {
            console.error(chalk.red(`\nError during pairing:`), error.message);
            return;
        }
    }

    store?.bind(trashcore.ev)
    
    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ? new mongoDB(opts['db']) : new JSONFile(`./library/database/database.json`));
    global.DATABASE = global.db;
    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function() {
            if (!global.db.READ) {
                clearInterval(this);
                resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
            }
        }, 1 * 1000));
        if (global.db.data !== null) return;
        global.db.READ = true;
        await global.db.read();
        global.db.READ = false;
        global.db.data = {
            users: {},
            chats: {},
            game: {},
            database: {},
            settings: {},
            setting: {},
            others: {},
            sticker: {},
            ...(global.db.data || {})
        };
        global.db.chain = _.chain(global.db.data);
    };
    loadDatabase();
    
    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write();
    }, 30 * 1000);

    trashcore.ev.on('creds.update', saveCreds)

	trashcore.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
    };

	trashcore.sendText = (jid, text, quoted = '', options) => trashcore.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });
	
    trashcore.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, receivedPendingNotifications } = update;
    
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            
            switch (reason) {
  case DisconnectReason.connectionLost:
                    console.log(color('Connection to Server Lost, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.connectionClosed:
                    console.log(color('Connection closed, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.restartRequired:
                    console.log(color('Restart Required...', 'red'));
                    start();
                    break;
                case DisconnectReason.timedOut:
                    console.log(color('Connection Timed Out, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.badSession:
                    console.log(color('Delete Session and Scan again...', 'red'));
                    start();
                    break;
                case DisconnectReason.connectionReplaced:
                    console.log(color('Close current Session first...', 'red'));
                    start();
                    break;
                case DisconnectReason.loggedOut:
                    console.log(color('Scan again and Run...', 'red'));
                    exec('rm -rf ./session/*');
                    process.exit(1);
                    break;
                case DisconnectReason.Multidevicemismatch:
                    console.log(color('Scan again...', 'green'));
                    exec('rm -rf ./session/*');
                    process.exit(0);
                    break;
                default:
                    trashcore.end(color(`Unknown DisconnectReason: ${reason}|${connection}`, 'red'));
                    break;
            }
        }
    
        if (connection === 'open') {
            console.log(color('Connected to: ' + JSON.stringify(trashcore.user, null, 2), 'red'));
        }
        if (receivedPendingNotifications === 'true') {
            console.log(color('Please wait About 1 Minute...', 'red'));
            trashcore.ev.flush();
        }
    });  
    trashcore.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
    };
    const connectMessage = `
[[ ༑📚𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚 𝑻𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆 ⿻ ༑]]
┏─•⛩️ ${global.botname} ⛩️•─⬣[⿻

👋 Hii, I Am ${global.botname}
 [⿻] 🌌 Version      : 1.2.0
 [⿻] 👤 Owner  	     : ${global.owner}
 [⿻] 📚 Library      : WBaileys MD
 [⿻] 📱 Status       : Online
 [⿻] 📝 Session     :  ${global.session}
 
 [⿻] 🌎 Base By    : trashcoredevs

┗─•${global.botname}•─⬣[⿻
[[ ༑📚𝑪𝒓𝒆𝒂𝒕𝒆 𝑩𝒚 𝒕𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆༢⿻ ༑]]
`;
        await delay(1999)
        trashcore.sendMessage("6666666@s.whatsapp.net",{
image: connectpic, 
caption: connectMessage
})
        //autostatus view
        trashcore.ev.on('messages.upsert', async chatUpdate => {
        	if (global.statusview){
        try {
            if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
            const mek = chatUpdate.messages[0];

            if (!mek.message) return;
            mek.message =
                Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = [ "❤️", "😍", "💙" ];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await trashcore.readMessages([mek.key]);
                trashcore.sendMessage(
                    'status@broadcast',
                    { react: { text: sigma, key: mek.key } },
                    { statusJidList: [mek.key.participant] },
                );
            }

        } catch (err) {
            console.error(err);
        }
      }
   }
 )
      trashcore.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = trashcore.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });
    
    trashcore.setStatus = (status) => {
        trashcore.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        });
        return status;
    };
    
    trashcore.public = true
    
    trashcore.getName = (jid, withoutContact = false) => {
        let id = trashcore.decodeJid(jid);
        withoutContact = trashcore.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = await trashcore.groupMetadata(id) || {};
                resolve(v.name || v.subject || PhoneNumber(`+${id.replace('@s.whatsapp.net', '')}`).getNumber('international'));
            });
        } else {
            v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === trashcore.decodeJid(trashcore.user.id) ? trashcore.user : (store.contacts[id] || {});
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber(`+${jid.replace('@s.whatsapp.net', '')}`).getNumber('international');
        }
    };
    
    trashcore.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await trashcore.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await trashcore.getName(i)}\nFN:${await trashcore.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            });
        }
        trashcore.sendMessage(jid, {
            contacts: {
                displayName: `${list.length} Kontak`,
                contacts: list
            },
            ...opts
        }, {
            quoted
        });
    };
    
    trashcore.serializeM = (m) => smsg(trashcore, m, store);
    trashcore.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url);
        mime = res.headers['content-type'];
        if (mime.split("/")[1] === "gif") {
            return trashcore.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                gifPlayback: true,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        let type = mime.split("/")[0] + "Message";
        if (mime === "application/pdf") {
            return trashcore.sendMessage(jid, {
                document: await getBuffer(url),
                mimetype: 'application/pdf',
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "image") {
            return trashcore.sendMessage(jid, {
                image: await getBuffer(url),
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "video") {
            return trashcore.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                mimetype: 'video/mp4',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "audio") {
            return trashcore.sendMessage(jid, {
                audio: await getBuffer(url),
                caption: caption,
                mimetype: 'audio/mpeg',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
    };
    
    trashcore.sendPoll = (jid, name = '', values = [], selectableCount = 1) => {
        return trashcore.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        });
    }
    ;
    trashcore.sendText = (jid, text, quoted = '', options) => trashcore.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });
    
    trashcore.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await trashcore.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        });
    };
    
    trashcore.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await trashcore.sendMessage(jid, {
            video: buffer,
            caption: caption,
            gifPlayback: gif,
            ...options
        }, {
            quoted
        });
    };
    
    trashcore.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await trashcore.sendMessage(jid, {
            audio: buffer,
            ptt: ptt,
            ...options
        }, {
            quoted
        });
    };
    
    trashcore.sendTextWithMentions = async (jid, text, quoted, options = {}) => {
        return trashcore.sendMessage(jid, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
        }, {
            quoted
        });
    };
    
    trashcore.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await imageToWebp(buff);
        }
        await trashcore.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        });
        return buffer;
    };
    
    trashcore.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }
        await trashcore.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        });
        return buffer;
    };
    
    trashcore.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };
    
    trashcore.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };
    
    trashcore.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await trashcore.getFile(path, true);
        let {
            mime,
            ext,
            res,
            data,
            filename
        } = types;
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            } catch (e) {
                if (e.json) throw e.json
            }
        }
        let type = '',
            mimetype = mime,
            pathFile = filename;
        if (options.asDocument) type = 'document';
        if (options.asSticker || /webp/.test(mime)) {
            let {
                writeExif
            } = require('./library/lib/exif');
            let media = {
                mimetype: mime,
                data
            };
            pathFile = await writeExif(media, {
                packname: options.packname ? options.packname : global.packname,
                author: options.author ? options.author : global.author,
                categories: options.categories ? options.categories : []
            });
            await fs.promises.unlink(filename);
            type = 'sticker';
            mimetype = 'image/webp';
        } else if (/image/.test(mime)) type = 'image';
        else if (/video/.test(mime)) type = 'video';
        else if (/audio/.test(mime)) type = 'audio';
        else type = 'document';
        await trashcore.sendMessage(jid, {
            [type]: {
                url: pathFile
            },
            caption,
            mimetype,
            fileName,
            ...options
        }, {
            quoted,
            ...options
        });
        return fs.promises.unlink(pathFile);
    }
    
    trashcore.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype;
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
            vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = {
                ...message.message.viewOnceMessage.message
            };
        }
        let mtype = Object.keys(message.message)[0];
        let content = await generateForwardMessageContent(message, forceForward);
        let ctype = Object.keys(content)[0];
        let context = {};
        if (mtype != "conversation") context = message.message[mtype].contextInfo;
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {});
        await trashcore.relayMessage(jid, waMessage.message, {
            messageId: waMessage.key.id
        });
        return waMessage;
    }
    
    trashcore.cMod = (jid, copy, text = '', sender = trashcore.user.id, options = {}) => {
        // let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0];
        let isEphemeral = mtype === 'ephemeralMessage';
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
        let content = msg[mtype];
        if (typeof content === 'string') msg[mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== 'string') msg[mtype] = {
            ...content,
            ...options
        };
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
        copy.key.remoteJid = jid;
        copy.key.fromMe = sender === trashcore.user.id;
        return proto.WebMessageInfo.fromObject(copy);
    }
    
    trashcore.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await trashcore.getFile(path, true);
        let {
            res,
            data: file,
            filename: pathFile
        } = type;
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                };
            } catch (e) {
                if (e.json) throw e.json;
            }
        }
        let opt = {
            filename
        };
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        let mtype = '',
            mimetype = type.mime,
            convert;
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
        else if (/video/.test(type.mime)) mtype = 'video';
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext);
            file = convert.data;
            pathFile = convert.filename;
            mtype = 'audio';
            mimetype = 'audio/ogg codecs=opus';
        } else mtype = 'document';
        if (options.asDocument) mtype = 'document';
        delete options.asSticker;
        delete options.asLocation;
        delete options.asVideo;
        delete options.asDocument;
        delete options.asImage;
        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        };
        let m;
        try {
            m = await trashcore.sendMessage(jid, message, {
                ...opt,
                ...options
            });
        } catch (e) {
            // console.error(e)
            m = null;
        } finally {
            if (!m) m = await trashcore.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            });
            file = null;
            return m;
        }
    }
    
    trashcore.getFile = async (PATH, save) => {
        let res;
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.?\/.?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
        // if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        };
        filename = path.resolve(__dirname, './library/src/' + new Date * 1 + '.' + type.ext);
        if (data && save) fs.promises.writeFile(filename, data);
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        };
    }
	
	trashcore.ev.on('creds.update', saveCreds)
	
	trashcore.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            let m = smsg(trashcore, mek, store);
            require("./trashhandler.js")(trashcore, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });
    return trashcore;

}


start();


let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});