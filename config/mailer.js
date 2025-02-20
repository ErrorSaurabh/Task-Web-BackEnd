const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'saurabhchauragade69@gmail.com',
        pass: 'tmxdwwplorcltsmz'    
    }
});

module.exports = transporter;
