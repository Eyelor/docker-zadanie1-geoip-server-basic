const http = require('http');
const geoip = require('geoip-lite');

// Function handling HTTP requests
const requestHandler = (request, response) => {
  // Get client's IP address
  const clientIP = request.socket.remoteAddress;

  // Get client's IP address from X-Forwarded-For header
  const clientForwardedIPs = request.headers['x-forwarded-for'];

  // Determine the real client IP address (based on X-Forwarded-For header or the IP address from HTTP header if X-Forwarded-For header is not defined)
  const clientRealIP = (clientForwardedIPs && clientForwardedIPs.split(',')[0].trim()) || clientIP;

  // Determine client's timezone and location based on IP address (if fails, default to UTC timezone with en locale format)
  const clientGeo = geoip.lookup(clientRealIP);
  const clientTimeZone = clientGeo && clientGeo.timezone ? clientGeo.timezone : 'UTC';
  const clientLocale = clientGeo && clientGeo.country ? clientGeo.country.toLowerCase() : 'en';

  // Get client's date and time in client's timezone
  const clientTime = new Date().toLocaleString(clientLocale, {timeZone: clientTimeZone});

  // Get server's date and time
  const serverTime = new Date().toLocaleString(clientLocale);

  // Set response header
  response.writeHead(200, {'Content-Type': 'text/html'});

  // Generate page content
  const htmlContent = `
    <html>
      <head>
        <title>Client Data</title>
      </head>
      <body>
        <h1>Client Data</h1>
        <p>Client IP address: ${clientRealIP}</p>
        <p>Client timezone: ${clientTimeZone}</p>
        <p>Date and time in client's timezone: ${clientTime}</p>
        <p>Server date and time: ${serverTime}</p>
      </body>
    </html>
  `;

  // Send response to client
  response.end(htmlContent);
};

// Create HTTP server
const server = http.createServer(requestHandler);

// Configure host
const host = '0.0.0.0';

// Configure port (if not defined in PORT environment variable, set to 3000)
const port = process.env.PORT || 3000;

// Run the server
server.listen(port, host, (err) => {
  if (err) {
    return console.log('Error while starting the server:', err);
  }

  // Get current date and time
  const currentDate = new Date().toLocaleString('pl-PL');

  // Display server startup information
  console.log(`Server has been started on port ${port}, date: ${currentDate}, author: Jakub Kopeć`);
});
