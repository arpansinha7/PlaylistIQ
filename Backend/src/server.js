import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import pg from 'pg';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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



app.get("/auth/google", passport.authenticate("google",{
    scope: ["profile", "email"],
    prompt: "consent",
    })
);

app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    }),
    (req, res) => {
        res.redirect("http://localhost:5173/app");
    }
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

const saltRounds = 10;

app.post("/api/auth/register", async (req, res) => {

    try
    {
        const { first_name, middle_name, last_name, username, email, password } = req.body;

        if(
            !first_name?.trim() ||
            !last_name?.trim() ||
            !username?.trim() || 
            !email?.trim() || 
            !password?.trim()
        )
        {
            return res.status(400).json({
                error: "Please fill in all required fields"
            });
        }

        if(password.length < 8)
        {
            return res.status(400).json({
                error: "Password must be at least 8 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            "INSERT INTO users (first_name, middle_name, last_name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6);",
            [first_name, middle_name, last_name, username, email, hashedPassword]
        );

        res.status(200).json({
            message: "Registration successful"
        });

    }
    catch(error)
    {
        if(error.code === '23505')
        {
            if(error.constraint === "unique_username")
            {
                return res.status(409).json({
                    error: "Username already exists"
                });
            }

            if(error.constraint === "unique_email")
            {
                return res.status(409).json({
                    error: "Email already exists"
                })
            }
        }
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.post("/api/auth/login", async (req, res) => {

    try
    {
        const { usernameOrEmail, password } = req.body;

        if(!usernameOrEmail || !password)
        {
            return res.status(400).json({
                error: "Please fill in all required fields"
            });
        }

        if(password.length < 8)
        {
            return res.status(400).json({
                error: "Password must be at least 8 characters"
            });
        }

        const result = await pool.query(
            "SELECT password_hash FROM users WHERE username = $1 OR email = $1;",
            [usernameOrEmail]
        );

        if(result.rows.length === 0)
        {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const storedHashPassword = result.rows[0].password_hash;

        const isValidPassword = await bcrypt.compare(password, storedHashPassword);

        if(!isValidPassword)
        {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });
    }
    catch(error)
    {
        console.log(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
app.post("/api/youtube/playlist", async (req, res) => {

    try
    {
        const { playlistId } = req.body;

        if(!playlistId)
        {
            return res.status(400).json({
                error: 'Playlist ID is required.'
            });
        }
        let allVideos = [];
        let nextPageToken = null;
     do{
        const url = new URL(
            'https://www.googleapis.com/youtube/v3/playlistItems'
        );

        url.searchParams.set('part', 'snippet');
        url.searchParams.set('playlistId', playlistId);
        url.searchParams.set('maxResults', '50');
        url.searchParams.set('key', process.env.YOUTUBE_API_KEY);
        
        if(nextPageToken)
        {
            url.searchParams.set("pageToken", nextPageToken);
        }
        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok)
        {
            return res.status(response.status).json(data);
        }

        const videos = data.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            position: item.snippet.position
        }));

        allVideos.push(...videos);
        nextPageToken = data.nextPageToken || null;

    }while(nextPageToken);

    const videoIds = allVideos.map(video => video.videoId);

    const availableVideoIds = new Set();

    for(let i = 0; i < videoIds.length; i += 50)
    {
        const batch = videoIds.slice(i, i+50);

        const url = new URL(
            'https://www.googleapis.com/youtube/v3/videos'
        );

        url.searchParams.set('part', 'id');
        url.searchParams.set('id', batch.join(','));
        url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok)
        {
            return res.status(response.status).json(data);
        }

        data.items.forEach(video => {
            availableVideoIds.add(video.id);
        });

    }

    allVideos = allVideos.map(video => ({
        ...video,
        available: availableVideoIds.has(video.videoId)
    }));

        res.json({
            playlistId,
            videos: allVideos
        });

    const aiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playlistId,
            videos: allVideos
        })
    });

    const aiData = await aiResponse.json();

    if(!aiResponse.ok)
    {
        return res.status(aiResponse.status).json(aiData);
    }

    const ingestResponse = await fetch('http://localhost:8000/ingest', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playlistId,
            videos: allVideos.map(video => ({
                videoId: video.videoId,
                title: video.title
            }))
        })
    });
    console.log(aiData);

    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.post("/api/youtube/playlist/ask", async (req, res) => {

    const { playlistId, userQuery } = req.body;

    if(!playlistId)
    {
        return res.status(400).json({
            error: 'Playlist ID is required'
        });
    }

    if(!userQuery?.trim())
    {
        return res.status(400).json({
            error: "Please enter a valid question"
        });
    }
    
    const aiResponse = await fetch('http://localhost:8000/ask', {
        
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            playlistId,
            userQuery
        })
    });

    
    
    if(!aiResponse.ok)
    {

        const error_text = await aiResponse.text();
        return res.status(aiResponse.status).json(error_text)
    }

    const aiData = await aiResponse.json();
    res.json(aiData);
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}...`);
});