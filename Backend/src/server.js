import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import pg from 'pg';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/auth.js';
import youtubeRouter from './routes/youtube.js';

const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

app.use(cors());
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            callbackURL: `http://localhost:${PORT}/auth/google/callback`
        },

        async (accessToken, refreshToken, profile, done) => {

            try
            {
                const googleId = profile.id;
                const email = profile.emails[0].value;
                
                const firstName = profile.name.givenName;
                const familyName = profile.name.familyName;

                const result = await pool.query(
                    "SELECT user_id FROM oauth_accounts WHERE provider = $1 AND provider_user_id = $2",
                    ["google", profile.id]
                );

                if(result.rows.length > 0)
                {
                    return done(null, { id: result.rows[0].user_id});
                }

                const findUser = await pool.query(
                    "SELECT id FROM users WHERE email = $1;",
                    [email]
                );

                if(findUser.rows.length > 0)
                {
                    const linkGoogle = await pool.query(
                        "INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, $2, $3);",
                        [findUser.rows[0].id, 'google', profile.id]
                    );
                    return done(null, findUser.rows[0]);
                }

                const newUser = await pool.query(
                    "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id;",
                    [firstName, familyName, email]
                );

                const userId = newUser.rows[0].id;

                const newOAuthUser = await pool.query(
                    "INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, $2, $3);",
                    [userId, 'google', profile.id]
                );

                return done(null, newUser.rows[0]);
                
            }
            catch(error)
            {
                return done(error);
            }
        }
    )
);




passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try
    {
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        done(null, result.rows[0]);
    }
    catch(error)
    {
        done(error);
    }
});

app.use(authRoutes(passport, bcrypt, pool));
app.use(youtubeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}...`);
});