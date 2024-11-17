import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' });

export const sendEmail = async (subject, bodyText, bodyHtml) => {
  try {
    const emailParams = {
      Source: 'crsjunior2001@gmail.com',
      Destination: {
        ToAddresses: ['crsjunior2001@gmail.com'],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: bodyText,
          },
          Html: {
            Data: bodyHtml,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
