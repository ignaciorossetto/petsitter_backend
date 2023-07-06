import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT,
    localHost: process.env.DEV_LOCAL_HOST,
    url: process.env.URL,
    feUrl: process.env.FE_URL,
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallBackUrlEndpoint: process.env.GOOGLE_CALLBACK_URL_ENDPOINT,
    jwtSecret: process.env.JWT_SECRET,
    profileImg : process.env.DEFAULT_PROFILE_IMG,
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    firebaseConfig : {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: 'pet-sitter-finder.appspot.com',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MESAUREMENT_ID
      },
    cookieSecret: process.env.COOKIE_SECRET
}