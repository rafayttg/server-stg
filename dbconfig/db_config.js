const { Sequelize, DataTypes } = require('sequelize');

// Define the Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_USER,
  process.env.DB,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // query: { raw: true },
    logging: false
  }
)

const Vendor = sequelize.define('vendor', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: DataTypes.STRING(255),
  phone: DataTypes.STRING(20),
  address_1: DataTypes.STRING(255),
  address_2: DataTypes.STRING(255),
  city: DataTypes.STRING(100),
  state: DataTypes.STRING(100),
  country: DataTypes.STRING(100),
  region: DataTypes.STRING(100),
  postal_code: DataTypes.STRING(20)
});



const VendorCode = sequelize.define('vendorcode', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  code: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  }
});



// Define associations
Vendor.hasMany(VendorCode, { onDelete: 'CASCADE' });
VendorCode.belongsTo(Vendor);






const VendorBilling = sequelize.define('vendorbilling', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  billing_contact_name: DataTypes.STRING(255),
  billing_email: DataTypes.STRING(255),
  billing_phone: DataTypes.STRING(20),
  billing_address: DataTypes.STRING(255),
  billing_city: DataTypes.STRING(100),
  billing_state: DataTypes.STRING(100),
  billing_country: DataTypes.STRING(100),
  billing_postal_code: DataTypes.STRING(20)
});

VendorCode.hasMany(VendorBilling, { foreignKey: 'vendorCodeId', as: 'billing' });
VendorBilling.belongsTo(VendorCode, { foreignKey: 'vendorCodeId' });



// Define the VendorPickup model
const VendorPickup = sequelize.define('vendorpickup', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  pickup_location_name: DataTypes.STRING(255),
  pickup_location_address: DataTypes.STRING(255),
  pickup_location_city: DataTypes.STRING(100),
  pickup_location_state: DataTypes.STRING(100),
  pickup_location_country: DataTypes.STRING(100),
  pickup_location_postal_code: DataTypes.STRING(20)
});


VendorCode.hasMany(VendorPickup, { foreignKey: 'vendorCodeId', as: 'pickup' });
VendorPickup.belongsTo(VendorCode, { foreignKey: 'vendorCodeId' });


const Admin = sequelize.define('admin', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // Use defaultValue instead of autoIncrement for UUID
  },
  email: {
    type: DataTypes.STRING, // Assuming email is a string
    allowNull: false,
    unique: true // Make email unique
  },
  password: {
    type: DataTypes.STRING, // Assuming password is a string
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50), // Assuming role is a string
    allowNull: false
  }
});





Admin.sync({ force: false }).then(() => {
  console.log('Admin table created successfully');
}).catch(err => {
  console.error('Error creating AdminRole table:', err);
});


Vendor.sync({ force: false }).then(() => {
  console.log('vendor table created successfully');
}).catch(err => {
  console.error('Error creating AdminRole table:', err);
});





module.exports = { Admin, Vendor, VendorBilling, VendorPickup, VendorCode, sequelize }; // Export the model