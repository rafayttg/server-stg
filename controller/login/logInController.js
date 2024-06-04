const { Admin } = require('../../dbconfig/db_config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.adminLogIn = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from req.body

    try {
        const storedAdmin = await Admin.findOne({ where: { email: email } })

        if (!storedAdmin) {
            return res.status(401).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, storedAdmin.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        } else {
            const token = generateAccessToken({ email: email })
            return res.status(200).send({ token: token , role : storedAdmin.role })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }

};

function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '30m' })
}