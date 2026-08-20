exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: { message: 'Method not allowed' } }) };
    }
    const authHeader = event.headers['authorization'] || event.headers['Authorization'];
    const apiKey = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;
    if (!apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: { message: 'Missing API key' } }) };
    }
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
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
