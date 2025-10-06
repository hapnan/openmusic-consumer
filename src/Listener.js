class Listener {
    constructor(PlaylistService, MailSender) {
        this._playlistService = PlaylistService;
        this._mailSender = MailSender;
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());
            const playlists = await this._playlistService.getPlaylists(playlistId);

            if (!playlists || playlists.length === 0) {
                throw new Error('No playlists found');
            }

            const content = JSON.stringify(playlists);
            const result = await this._mailSender.sendEmail(targetEmail, content);
            console.log(result);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
}

module.exports = Listener;
