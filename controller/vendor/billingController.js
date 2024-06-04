const { VendorBilling, VendorCode, sequelize } = require('../../dbconfig/db_config')
const { Op } = require('sequelize');



exports.getBillingInfo = async (req, res) => {
    try {

        const vendorBilling = await VendorBilling.findAll({ include: [{ model: VendorCode }], order: [['createdAt', 'ASC']] })
        if (vendorBilling.length === 0) {
            return res.status(404).json({ message: "No Billling Info found." });
        }

        res.status(200).send(vendorBilling);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "An error occurred while fetching vendors." });
    }
}

exports.createBillingInfo = async (req, res) => {
    const vendorCodeString = req.body.vendor_code;

    try {
        // Find the VendorCode based on the provided code
        const vendorCode = await VendorCode.findOne({
            where: { code: vendorCodeString }
        });

        if (vendorCode) {
            // If a matching vendor code is found, create a new VendorBilling entry associated with it
            const billingInfo = await VendorBilling.create({
                billing_contact_name: req.body.billing_contact_name,
                billing_email: req.body.billing_email,
                billing_phone: req.body.billing_phone,
                billing_address: req.body.billing_address,
                billing_city: req.body.billing_city,
                billing_state: req.body.billing_state,
                billing_country: req.body.billing_country,
                billing_postal_code: req.body.billing_postal_code,
                vendorCodeId: vendorCode.id // Associate the billing info with the found vendor code
            });

            // Include the vendorCode in the response
            const response = {
                ...billingInfo.toJSON(),
                vendorCode: vendorCode.code // Include vendorCode details
            };

            res.status(201).json(response);
        } else {
            res.status(401).json({ message: 'Vendor Not Found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBilling = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await VendorBilling.destroy({ where: { id } });

        if (result) {
            res.status(200).json({ message: 'VendorBilling record deleted successfully', id });
        } else {
            res.status(404).json({ message: 'VendorBilling record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting VendorBilling record', error: error.message });
    }
}

exports.updateBilling = async (req, res) => {
    const id = req.params.id;
    const billing = req.body; // Extract the updated values from the request body
    try {
        const existingBilling = await VendorBilling.findByPk(id);

        if (!existingBilling) {
            return res.status(404).json({ message: 'Billing Not Found' });
        }

        // Update the existing billing with new values
        await existingBilling.update(billing);


        // Fetch the updated billing record including associated VendorCode
        const updatedBilling = await VendorBilling.findByPk(id, {
            include: [{ model: VendorCode }],
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json({ response: updatedBilling });

    } catch (error) {
        console.error('Error updating Billing:', error); // Log the error to the console
        res.status(500).json({ message: 'Error updating Billing', error: error.message || error });
    }
};



exports.searchBilling = async (req, res) => {

    const { billing_contact_name, email, phone, city, country } = req.query;

  
    // Build the search conditions dynamically based on the query parameters
    let searchConditions = {};
    if (billing_contact_name) {
        searchConditions.billing_contact_name = { [Op.like]: `%${billing_contact_name}%` };
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
        const billling = await VendorBilling.findAll({
            where: searchConditions,
            include: [{ model: VendorCode }],
            order: [['createdAt', 'ASC']]
        });

        if (billling.length === 0) {
            return res.status(404).json({ message: "No Billing found." });
        }

        res.status(200).json(billling);
    } catch (error) {
        console.error("Error searching billling:", error);
        res.status(500).json({ message: "An error occurred while searching billling." });
    }
};
