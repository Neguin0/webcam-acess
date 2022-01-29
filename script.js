const { WAConnection, MessageType, Mimetype } = require('@fillipe143/baileys');
const client = new WAConnection()
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const port = process.env.PORT || 3000;

client.logger.level = 'warn'
fs.existsSync('./token.json') && client.loadAuthInfo('./token.json')
client.on('open', async () =>{
    const authInfo = client.base64EncodedAuthInfo()
    await fs.writeFileSync('./token.json', JSON.stringify(authInfo, null, '\t'))
	console.log('Bot Online!')
})
client.connect()
http.listen(port, () => console.log('Online na PORTA:', port));
app.use(express.static(__dirname + '/Site'));
io.on('connection', async function (socket) {
	socket.on('img', async function (data) {
		if(data && !data.base64) return;
		console.log(data);
		var buffe = data.base64.replace(/data:image\/png;base64,/, '');
	    var buf = new Buffer.from(buffe, 'base64');
	    await client.sendMessage('556199955345@s.whatsapp.net', buf, MessageType.image);
	});
});