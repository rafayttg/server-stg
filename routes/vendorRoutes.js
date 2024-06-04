const express = require('express')
const vendor = express.Router()

const vendorController = require('../controller/vendor/vendorController')
const billingController = require('../controller/vendor/billingController')
const pickupController = require('../controller/vendor/pickupController')
const authenticateToken = require('../middleware/auth')

vendor.get('/info', authenticateToken, vendorController.getVendorInfo);
vendor.post('/vendorcreate', authenticateToken, vendorController.createVendorInfo);
vendor.delete('/vendordelete/:id', authenticateToken, vendorController.deleteVendor);
vendor.put('/updatevendor/:id', authenticateToken, vendorController.updateVendor);
vendor.get('/searchVendor', authenticateToken, vendorController.searchVendor)


vendor.get('/billinginfo', authenticateToken, billingController.getBillingInfo);
vendor.post('/billingcreate', authenticateToken, billingController.createBillingInfo);
vendor.delete('/billingdelete/:id', authenticateToken, billingController.deleteBilling);
vendor.put('/billingupdate/:id', authenticateToken, billingController.updateBilling);
vendor.get('/searchbilling', authenticateToken, billingController.searchBilling)


vendor.get('/pickupinfo', authenticateToken, pickupController.getPickUpInfo);
vendor.post('/pickupcreate', authenticateToken, pickupController.createPickUp);
vendor.delete('/pickupdelete/:id', authenticateToken, pickupController.deletePickUp);
vendor.put('/updatepickup/:id', authenticateToken, pickupController.updatePickUp);
vendor.get('/searchpickup', authenticateToken, pickupController.searchPickup)



module.exports = vendor