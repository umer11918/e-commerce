const open = require('open');

// URL to be opened
const url = 'https://www.youtube.com/shorts/pGvvvI2T_lg';

// Function to open the URL
function openUrl() {
    open(url);
    console.log(`Opened URL: ${url}`);
}

// Open the URL immediately
openUrl();

// Set an interval to open the URL every minute (60000 milliseconds)
setInterval(openUrl, 60000);
