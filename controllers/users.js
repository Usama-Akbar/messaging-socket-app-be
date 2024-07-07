const User = require('../models/user');
const { generateAccessToken, deleteAccessToken } = require('../middlewares/auth');
const { encryptPassword, comparePassword } = require('../lib/encryption');
const makeApiResponse = require('../lib/response');
module.exports = {
    signUp: async function (req, res, next) {
        try {
            const password = await encryptPassword(req.body.password);
            const { email, username } = req.body;
            const user = new User({
                email,
                username,
                password,
            });
            const newUser = await user.save();
            const successResponse = makeApiResponse("User created successfully", 0, 201, { user: newUser });
            return res.status(201).json(successResponse);


        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }

    },
    login: async function (req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
            }
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                const errorResponse = makeApiResponse("Invalid email or password", 1, 401);
                return res.status(401).json(errorResponse);
            }
            const accessToken = await generateAccessToken({ user });
            const successResponse = makeApiResponse("Login successful", 0, 200, { user, accessToken });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    logout: async function (req, res, next) {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            await deleteAccessToken(token);
            const successResponse = makeApiResponse("Logout successful", 0, 200);
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    list: async function (req, res, next) {
        try {
            const users = await User.find().exec();
            const successResponse = makeApiResponse("Users fetched successfully", 0, 200, { users });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    specificUser: async function (req, res, next) {
        try {
            const { id } = req.params;
            const user
                = await User.findById(id).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
            }
            const successResponse = makeApiResponse("User fetched successfully", 0, 200, { user });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    updateUser: async function (req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
            }
            const { email, full_name } = req.body;
            user.email = email;
            user.full_name = full_name;
            await user.save();
            const successResponse = makeApiResponse("User updated successfully", 0, 200, { user });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    deleteUser: async function (req, res, next) {
        try {
            const { id } = req.params;
            const user = await User

                .findByIdAndDelete(id).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
            }
            const successResponse = makeApiResponse("User deleted successfully", 0, 200);
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    }

}