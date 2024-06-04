const { Admin } = require('../../dbconfig/db_config')
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.adminRegister = async (req, res) => {
    const { email, password, role } = req.body; // Destructure email, password, and role from req.body

    try {

        const isEmail = await Admin.findOne({ where: { email: email } })

        if (isEmail) {
            return res.status(400).json({ message: 'email already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create a new admin record in the database

        let newAdmin = new Admin({
            email: email,
            password: hashedPassword,
            role: role
        })

        await newAdmin.save()
        // Return success response
        res.status(201).json({ messgae : "Admin registered successfully" , role: newAdmin.role })


    } catch (error) {
        // Return error response
        res.status(500).json({ message: error.message });
    }
}


