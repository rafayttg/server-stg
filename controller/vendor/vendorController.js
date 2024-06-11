const { Vendor, VendorBilling, VendorPickup, VendorCode, sequelize } = require('../../dbconfig/db_config')
const { Op } = require('sequelize');

const { pool } = require('../../dbconfig/db')

exports.getVendorInfo = async (req, res) => {
    try {
        const vendors = await Vendor.findAll({ include: [{ model: VendorCode }], order: [['createdAt', 'ASC']] })

        if (vendors.length === 0) {
            return res.status(404).json({ message: "No vendors found." });
        }

        res.status(200).json({ response: vendors });
        // res.send(rows.rows);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "An error occurred while fetching vendors." });
    }
};


exports.createVendorInfo = async (req, res) => {
   
    const vendorData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address_1: req.body.address_1,
        address_2: req.body.address_2,
        city: req.body.city,
        country: req.body.country,
        region: req.body.region,
        state: req.body.stateProvince,
        postal_code: req.body.zipPostal
    };

    console.log (vendorData)

    const vendorCodeData = {
        code: req.body.code
    };

    const t = await sequelize.transaction();

    try {
        const newVendor = await Vendor.create(vendorData, { transaction: t });
        vendorCodeData.vendorId = newVendor.id;
        const newVendorCode = await VendorCode.create(vendorCodeData, { transaction: t });
        await t.commit();

        const response = {
            ...newVendor.get({ plain: true }),
            vendorCode: newVendorCode.code
        };

        res.status(201).json({ response: response, message: 'Vendor Created Succesfully' });
        // res.status(201).json(response);
        // const newVendor = await vendor.save();
        // const newVendorCode = await vendorCode.save()
        // res.status(201).json({ newVendor, newVendorCode });
    } catch (error) {
        await t.rollback();
        console.error("Error creating vendor:", error);
        res.status(400).json({ message: "An error occurred while creating the vendor." });
    }
};


exports.deleteVendor = async (req, res) => {
    const vendorId = req.params.id;
    const t = await sequelize.transaction();

    try {
        const vendor = await Vendor.findOne({ where: { id: vendorId }, include: [VendorCode], transaction: t });
        if (!vendor) {
            await t.rollback();
            return res.status(404).json({ message: "Vendor not found." });
        }

        // Find all VendorCodes associated with the vendor
        const vendorCodes = await VendorCode.findAll({ where: { vendorId }, transaction: t });

        // Delete VendorBilling records associated with each VendorCode
        for (const vendorCode of vendorCodes) {
            await VendorBilling.destroy({ where: { vendorCodeId: vendorCode.id }, transaction: t });
        }

        // Delete VendorCode records associated with the vendor
        await VendorCode.destroy({ where: { vendorId }, transaction: t });

        // Delete the vendor
        await Vendor.destroy({ where: { id: vendorId }, transaction: t });

        await t.commit();

        res.status(200).json({ message: 'Vendor deleted successfully', vendorId });
    } catch (error) {
        await t.rollback();
        console.error("Error deleting vendor:", error);
        res.status(400).json({ message: "An error occurred while deleting the vendor." });
    }
};


exports.updateVendor = async (req, res) => {
    const { id } = req.params;
    const { vendor, vendorCode } = req.body; // Default to an empty array if vendorCodes is undefined

    try {
        const existingVendor = await Vendor.findByPk(id);
        if (!existingVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Update vendor
        await existingVendor.update(vendor);

        // Update or create vendor code
        const existingVendorCode = await VendorCode.findOne({ where: { vendorId: id } });
        if (existingVendorCode) {
            await existingVendorCode.update(vendorCode);
        } else {
            await VendorCode.create({ ...vendorCode, vendorId: id });
        }

        

        const updatedVendor = await Vendor.findByPk(id, {
            include: [VendorCode]
        });

        res.status(200).json({ response: updatedVendor });
    } catch (error) {
        console.error('Error updating vendor:', error); // Log the error to the console
        res.status(500).json({ message: 'Error updating vendor', error: error.message || error });
    }
};


exports.searchVendor = async (req, res) => {

    const { name, email, phone, city, country } = req.query;

  
    // Build the search conditions dynamically based on the query parameters
    let searchConditions = {};
    if (name) {
        searchConditions.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
        searchConditions.email = { [Op.like]: `%${email}%` };
    }
    if (phone) {
        searchConditions.phone = { [Op.like]: `%${phone}%` };
    }
    if (city) {
        searchConditions.city = { [Op.like]: `%${city}%` };
    }
    if (country) {
        searchConditions.country = { [Op.like]: `%${country}%` };
    }

    try {
        const vendors = await Vendor.findAll({
            where: searchConditions,
            include: [{ model: VendorCode }],
            order: [['createdAt', 'ASC']]
        });

        if (vendors.length === 0) {
            return res.status(404).json({ message: "No vendors found." });
        }

        res.status(200).json(vendors);
    } catch (error) {
        console.error("Error searching vendors:", error);
        res.status(500).json({ message: "An error occurred while searching vendors." });
    }
};




