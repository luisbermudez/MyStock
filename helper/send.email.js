const sgMail = require('@sendgrid/mail');

async function sendEmail(Toemail, data, id){
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: Toemail,
            from: 'deadstarheaven@outlook.com',
            templateId: id,
            dynamic_template_data: data,
        };
        await sgMail.send(msg);
        return true;
}catch(err){
    console.log("error sending email", err);
    return false;
}};

module.exports = { sendEmail }