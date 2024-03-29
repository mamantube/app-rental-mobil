import "dotenv/config";

const PORT = process.env.PORT || 3000;
const URL_MONGODB = process.env.URL_MONGODB || "" ;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN || "" ;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN || "" ;
const SECRET_KEY = process.env.SECRET_KEY;
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANSS_URL_API = process.env.MIDTRANSS_URL_API;
const URL_REAL_MONGODB = process.env.URL_REAL_MONGODB; //gunakan pada config jika sudah deploy

export {
    PORT,
    URL_MONGODB,
    EMAIL_ADMIN,
    PASSWORD_ADMIN,
    SECRET_KEY,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    MIDTRANS_CLIENT_KEY,
    MIDTRANS_SERVER_KEY,
    MIDTRANSS_URL_API,
    URL_REAL_MONGODB,
}
