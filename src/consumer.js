require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./PlaylistServices');
const Mailsender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
    const playlistService = new PlaylistService();
    const mailSender = new Mailsender();
    const listener = new Listener(playlistService, mailSender);

    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
        durable: true,
    });

    // Bind the listen method to maintain context
    channel.consume('export:playlists', listener.listen.bind(listener), { noAck: true });
};

init();
