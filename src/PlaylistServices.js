const { Pool } = require('pg');

class PlaylistServices {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(playlistId) {
        const query = {
            text: `SELECT * FROM playlists WHERE id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = PlaylistServices;
