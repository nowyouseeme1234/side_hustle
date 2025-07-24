// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { OAuth2Client } from 'google-auth-library'; // Import for Google auth
import pool from '../config/db.config.js'; // Your MySQL connection pool

// Initialize Google OAuth2Client with your backend's Google Client ID
// This client ID must match the one used in your .env file
console.log('Backend Startup: GOOGLE_CLIENT_ID (from .env):', process.env.GOOGLE_CLIENT_ID);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT
const generateJwtToken = (user) => {
    const payload = {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };
    // Use JWT_SECRET from environment variables
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

// @route   POST /api/auth/signup
// @desc    Register a new user (traditional)
// @access  Public
export const signup = async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // Basic validation (you can add more robust validation here)
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Check if username or email already exists
        const [existingUsers] = await pool.execute(
            'SELECT id, email, username FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            if (existingUsers.some(user => user.email === email)) {
                return res.status(409).json({ message: 'User with that email already exists.' });
            }
            if (existingUsers.some(user => user.username === username)) {
                return res.status(409).json({ message: 'Username is already taken.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, phone_number) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, phoneNumber || null] // Use null if phoneNumber is not provided
        );

        const userId = result.insertId;

        // Optional: Automatically log in after signup (as your frontend does)
        // Fetch the newly created user to generate JWT
        const [newUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const newUser = newUsers[0];

        if (!newUser) {
            return res.status(500).json({ message: 'User created but could not be fetched for login.' });
        }

        const token = generateJwtToken(newUser);
        // Exclude password from the user object sent to the frontend
        const { password: userPassword, ...userWithoutPassword } = newUser;

        res.status(201).json({ 
            message: 'User registered successfully!', 
            userId,
            user: userWithoutPassword, // Send cleaned user object
            token // Send JWT token
        });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (traditional)
// @access  Public
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];

        // IMPORTANT: Check if the user has a password. Google-signed-up users won't have one.
        if (!user.password) {
            return res.status(401).json({ message: 'This account was created via Google. Please log in with Google.' });
        }

        const storedPassword = user.password; // Access password directly from the user object
        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = generateJwtToken(user);

        // Exclude password from the user object sent to the frontend
        const { password: userPassword, ...userWithoutPassword } = user;

        res.status(200).json({ 
            message: 'Login successful!', 
            userId: user.id, // Keep userId for compatibility
            user: userWithoutPassword, // Send cleaned user object
            token // Send JWT token
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Failed to login.' });
    }
};

// @route   POST /api/auth/google
// @desc    Authenticate or register user via Google ID Token
// @access  Public
export const googleAuth = async (req, res) => {
    const { token } = req.body; // The ID token from the frontend

    if (!token) {
        return res.status(400).json({ message: 'Google ID token is required.' });
    }

    try {
        // 1. Verify the ID token with Google's API
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure the token is for your client ID
        });
        const payload = ticket.getPayload();

        const googleId = payload.sub; // Unique Google user ID
        const email = payload.email;
        const username = payload.name; // User's full name from Google profile
        // Removed: const profilePicture = payload.picture; // No longer storing this

        // 2. Check if a user already exists in your DB with this Google ID or email
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE google_id = ? OR email = ?',
            [googleId, email]
        );

        let user;
        if (existingUsers.length > 0) {
            user = existingUsers[0];
            // User exists - log them in
            // If the user previously signed up with email/password and now logs in with Google using the same email,
            // link their Google ID to their existing account.
            if (!user.google_id) { // If user exists but no google_id linked
                await pool.execute(
                    'UPDATE users SET google_id = ? WHERE id = ?', // Removed profile_picture from UPDATE
                    [googleId, user.id]
                );
                // Manually update user object to reflect changes without re-fetching
                user.google_id = googleId;
            }
            const jwtToken = generateJwtToken(user);
            const { password: userPassword, ...userWithoutPassword } = user; // Exclude password
            res.json({ message: 'Login successful via Google!', user: userWithoutPassword, token: jwtToken });
        } else {
            // User does NOT exist - create a new user account
            // Consider handling username uniqueness if 'username' from Google might not be unique
            // For simplicity, we'll try to use the google username and append a number if it conflicts.
            let finalUsername = username;
            const [usernameCheck] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
            if (usernameCheck.length > 0) {
                // Append a random number if username already exists
                finalUsername = `${username}_${Math.floor(Math.random() * 10000)}`;
            }

            const [result] = await pool.execute(
                'INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)', // Removed profile_picture from INSERT
                [finalUsername, email, googleId]
            );

            // Fetch the newly created user to get the full object including 'id' and 'created_at'
            const [newUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUsers[0];

            const jwtToken = generateJwtToken(user);
            const { password: userPassword, ...userWithoutPassword } = user; // Exclude password
            res.status(201).json({ message: 'Account created and logged in via Google!', user: userWithoutPassword, token: jwtToken });
        }
    } catch (error) {
        console.error('Google Auth Error:', error.message);
        res.status(401).json({ message: 'Google authentication failed or invalid token.' });
    }
};