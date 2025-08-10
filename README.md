# side_hustle
A way for people to buy and sell their monthly incomes
# How to configure
1. clone the files from the master branch
2. install xampp and node
3. create database "sharemyrentdb"
4. start xampp
5. sql the following:
   CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `google_id` VARCHAR(255) DEFAULT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `listings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `owner_id` INT(11) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `property_type` VARCHAR(50),
  `bedrooms` INT(11),
  `bathrooms` INT(11),
  `square_footage` INT(11),
  `description` TEXT,
  `monthly_rent` DECIMAL(10, 2),
  `income_percentage` DECIMAL(5, 2),
  `asking_price` DECIMAL(10, 2),
  `lease_terms` TEXT,
  `terms_agreed` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `listing_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `listing_id` INT(11) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON DELETE CASCADE
);

6. on the cloned folder cd to client and then do npm run dev
7. on the cloned folder cd to server and then do npm start

8. That's it!
