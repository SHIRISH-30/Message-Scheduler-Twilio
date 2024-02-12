const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const path = require('path');
const twilio = require('twilio');

const app = express();
const port = 7000;

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const accountSid = 'YOUR ID';
const authToken = 'YOUR ID';
const twilioPhoneNumber = 'TWILIO NUMBER';
// Twilio configuration
;
const twilioClient = twilio(accountSid, authToken);


// Route to render the form
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle form submission
app.post('/schedule', (req, res) => {
    const {  receiverNumber, message, scheduleTime } = req.body;

    // Convert scheduleTime to a Date object
    const scheduledDate = new Date(scheduleTime);

    // Schedule the message
    schedule.scheduleJob(scheduledDate, async () => {
        try {
            // Send WhatsApp message using Twilio
            await twilioClient.messages.create({
                body: message,
                from: 'whatsapp:+twilionumber',
                to: `whatsapp:+91${receiverNumber}`,
                body: message,
            });

            console.log(`Message sent to ${receiverNumber}: ${message}`);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
