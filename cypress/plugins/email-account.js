const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const makeEmailAccount = async () => {

    const testAccount = await nodemailer.createTestAccount()

    const emailConfig = {
        imap: {
            user: testAccount.user,
            password: testAccount.pass,
            host: 'imap.ethereal.email',
            port: 993,
            tls: true,
            authTimeout: 10000
        }
    }
    console.log('created new email account %s', testAccount.user)
    console.log('for debugging, the password is %s', testAccount.pass)

    const userEmail = {
        email: testAccount.user,

        async getLastEmail() {
            console.log('getting the last email')
            console.log(emailConfig)

            try {
                const connection = await imaps.connect(emailConfig)

                await connection.openBox('INBOX')
                const searchCriteria = ['1:10']
                const fetchOptions = {
                    bodies: ['']
                }
                const messages = await connection.search(searchCriteria, fetchOptions)
                //closing connection to avoid hanging
                await connection.end()

                if (!messages.length) {
                    console.log('cannot find any emails')
                    return null
                }
                else {
                    console.log('There are %d messages', messages.length)
                    //take the last email
                    const mail = await simpleParser(
                        messages[messages.length - 1].parts[0].body,
                    )
                    console.log(mail.subject)
                    console.log(mail.text)

                    const codeRegex = /Your code is: (\d+)/;

                    // Extract the code using the regular expression
                    const match = mail.text.match(codeRegex);
                    // Check if a match is found and extract the code
                    if (match && match[1]) {
                        const code = match[1];
                        console.log("Code:", code);
                        return code;
                    } else {
                        console.log("Code not found in email text.");
                        return 0;
                    }
                }
            } catch (e) {
                console.error(e)
                return null
            }
        }
    }
    return userEmail
}

module.exports = { makeEmailAccount }