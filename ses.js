const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = function (recipaient, massage, subject) {
    return ses
        .sendEmail({
            Source: "mehrdad good man  <mehrdad.test89@gmail.com>",
            Destination: {
                ToAddresses: [recipaient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: massage,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise();
};
