CREATE TABLE vendor (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
	"region" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "billing_contact_name" VARCHAR(255),
    "billing_email" VARCHAR(255),
    "billing_phone" VARCHAR(20),
    "billing_address" VARCHAR(255),
    "billing_city" VARCHAR(100),
    "billing_state" VARCHAR(100),
    "billing_country" VARCHAR(100),
    "billing_postal_code" VARCHAR(20),
    "pickup_location_name" VARCHAR(255),
    "pickup_location_address" VARCHAR(255),
    "pickup_location_city" VARCHAR(100),
    "pickup_location_state" VARCHAR(100),
    "pickup_location_country" VARCHAR(100),
    "pickup_location_postal_code" VARCHAR(20)
);