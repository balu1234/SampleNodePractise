const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendSMS = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: "+91"+to
        });
        
        console.log('SMS sent successfully:', response.sid);
        return {
            success: true,
            messageId: response.sid,
            status: response.status
        };
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS: ' + error.message);
    }
};

exports.sendWelcomeSMS = async (phoneNumber, username) => {
    const message = `Welcome ${username} to our platform! Thank you for joining us.`;
    return this.sendSMS(phoneNumber, message);
};

exports.sendVerificationCode = async (phoneNumber, code) => {
    const message = `Your verification code is: ${code}. This code will expire in 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
}; 