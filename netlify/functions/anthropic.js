exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: { message: 'Method not allowed' } }) };
    }
    const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
    if (!apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: { message: 'Missing API key' } }) };
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: event.body,
    });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: String(err) } }) };
  }
};
