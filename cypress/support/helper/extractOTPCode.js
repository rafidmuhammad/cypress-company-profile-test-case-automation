const simpleParser = require('mailparser').simpleParser;


export function extractOTPCode(email_body) {
    const codeRegex = /Your code is: (\d+)/;
    // Extract the code using the regular expression
    const match = email_body.match(codeRegex);
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