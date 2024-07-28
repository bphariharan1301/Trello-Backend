const User = require("../models/user");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const generateAccessToken = (user) => {
    console.log("generateAccessToken: ", user);
    console.log("JWT_SECRET", process.env.JWT_SECRET);
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (user) => {
    console.log("generateRefreshToken: ", user);
    console.log("REFRESH_TOKEN_SECRET", process.env.REFRESH_TOKEN_SECRET);
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("email, password: ", email, password);
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.json({
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.tokenVersion += 1;
            await user.save();
            res.json({ message: "User logged out successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const newAccessToken = generateAccessToken({ id: decoded.id });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports = { register, login, logout, refreshAccessToken };
