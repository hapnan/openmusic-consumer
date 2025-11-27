const { Pool } = require('pg');

class PlaylistServices {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(playlistId) {
        const query = {
            text: `SELECT p.id, p.name,
                        COALESCE(
                            jsonb_agg(
                                jsonb_build_object(
                                    'id', s.id,
                                    'title', s.title,
                                    'performer', s.performer
                                ) ORDER BY s.title
                            ) FILTER (WHERE s.id IS NOT NULL),
                            '[]'::jsonb
                        ) AS songs
                    FROM playlists p
                    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
                    LEFT JOIN songs s ON ps.song_id = s.id
                    WHERE p.id = $1
                    GROUP BY p.id, p.name;`,
            values: [playlistId]
        };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
    }
}

module.exports = PlaylistServices;
