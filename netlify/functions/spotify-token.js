const https = require('https');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: 'Method not allowed'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const {
      code,
      refresh_token
    } = body;

    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Spotify environment variables missing'
        })
      };
    }

    let params;

    // ─────────────────────────────────────────────
    // REFRESH TOKEN FLOW
    // ─────────────────────────────────────────────
    if (refresh_token) {
      params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      });
    }

    // ─────────────────────────────────────────────
    // AUTH CODE FLOW
    // ─────────────────────────────────────────────
    else if (code) {
      params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      });
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing code or refresh_token'
        })
      };
    }

    const authHeader = Buffer.from(
      `${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString('base64');

    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'accounts.spotify.com',
          path: '/api/token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(
              params.toString()
            ),
            Authorization: `Basic ${authHeader}`
          }
        },
        (res) => {
          let data = '';

          res.on('data', chunk => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);

              if (res.statusCode >= 400) {
                reject(
                  new Error(
                    parsed.error_description ||
                    parsed.error ||
                    'Spotify API error'
                  )
                );
                return;
              }

              resolve(parsed);
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on('error', reject);

      req.write(params.toString());
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

  } catch (err) {
    console.error('Spotify token error:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};