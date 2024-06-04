const { VendorPickup, VendorCode, sequelize } = require('../../dbconfig/db_config')
const { Op } = require('sequelize');


exports.getPickUpInfo = async (req, res) => {
    try {
        // const users = await vendor.findAll();
        const vendorPickup = await VendorPickup.findAll({ include: [{ model: VendorCode }], order: [['createdAt', 'ASC']] })

        if (vendorPickup.length === 0) {
            return res.status(404).json({ message: "No pickup found." });
        }


        res.status(200).send(vendorPickup);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "An error occurred while fetching vendors." });
    }
}

exports.createPickUp = async (req, res) => {
    const vendorCodeString = req.body.vendor_code;
    try {
        // Find the VendorCode based on the provided code
        const vendorCode = await VendorCode.findOne({
            where: { code: vendorCodeString }
        });
        console.log(vendorCode.id)

        if (vendorCode) {
            // If a matching vendor code is found, create a new vendorPickup entry associated with it
            const pickUpInfo = await VendorPickup.create({
                pickup_location_name: req.body.pickup_location_name,
                pickup_location_address: req.body.pickup_location_address,
                pickup_location_city: req.body.pickup_location_city,
                pickup_location_state: req.body.pickup_location_state,
                pickup_location_country: req.body.pickup_location_country,
                pickup_location_postal_code: req.body.pickup_location_postal_code,
                vendorCodeId: vendorCode.id // Associate the pickup info with the found vendor code
            });

            // Include the vendorCode in the response
            const response = {
                ...pickUpInfo.toJSON(),
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

exports.deletePickUp = async (req, res) => {
    const id = req.params.id
    try {
        const vendorDelete = await VendorPickup.destroy({ where: { id } })
        if (vendorDelete) {
            res.status(200).json({ message: 'Pickup record deleted successfully', id });
        } else {
            res.status(404).json({ message: 'Pickup record not found' });
        }
    } catch (error) {
        es.status(500).json({ message: 'Error deleting Vendorpickup record', error: error.message });
    }
}

exports.updatePickUp = async (req, res) => {
    const id = req.params.id;
    const pickup = req.body; // Extract the updated values from the request body
    try {
        const existingPickup = await VendorPickup.findByPk(id);

        if (!existingPickup) {
            return res.status(404).json({ message: 'Pickup Not Found' });
        }

        // Update the existing pickup with new values
        await existingPickup.update(pickup);


        // Fetch the updated pickup record including associated VendorCode
        const updatedPickup = await VendorPickup.findByPk(id, {
            include: [{ model: VendorCode }],
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json({ response: updatedPickup });

    } catch (error) {
        console.error('Error updating pickup:', error); // Log the error to the console
        res.status(500).json({ message: 'Error updating pickup', error: error.message || error });
    }
}


exports.searchPickup = async (req, res) => {

    const { pickup_location_name, email, phone, city, country } = req.query;

  
    // Build the search conditions dynamically based on the query parameters
    let searchConditions = {};
    if (pickup_location_name) {
        searchConditions.pickup_location_name = { [Op.like]: `%${pickup_location_name}%` };
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
        const pickup = await VendorPickup.findAll({
            where: searchConditions,
            include: [{ model: VendorCode }],
            order: [['createdAt', 'ASC']]
        });

        if (pickup.length === 0) {
            return res.status(404).json({ message: "No pickup found." });
        }

        res.status(200).json(pickup);
    } catch (error) {
        console.error("Error searching pickup:", error);
        res.status(500).json({ message: "An error occurred while searching pickup." });
    }
};
