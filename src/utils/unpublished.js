import "dotenv/config";

const PORT = process.env.PORT;
const URL_MONGODB = process.env.URL_MONGODB;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

export {
    PORT,
    URL_MONGODB,
    EMAIL_ADMIN,
    PASSWORD_ADMIN,
}
