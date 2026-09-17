import express from 'express';

const router = express.Router();

const authRoutes = (passport, bcrypt, pool) => {
    router.get("/auth/google", passport.authenticate("google",{
        scope: ["profile", "email"],
        prompt: "consent",
        })
    );

    router.get("/auth/google/callback", passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login",
        }),
        (req, res) => {
            res.redirect("http://localhost:5173/app");
        }
    );

    const saltRounds = 10;

    router.post("/api/auth/register", async (req, res) => {

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

    router.post("/api/auth/login", async (req, res) => {

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
                "SELECT password_hash FROM users WHERE username = $1 OR email = $2;",
                [usernameOrEmail, usernameOrEmail]
            );

            if(result.rows.length === 0)
            {
                return res.status(401).json({
                    error: "Invalid username or password"
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

            console.log(error.message);

            return res.status(500).json({
                error: "Internal server error"
            });
        }
    });
    
    return router;
}

export default authRoutes;