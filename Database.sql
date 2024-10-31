-- Create database (Case no database)
CREATE DATABASE IF NOT EXISTS point_of_sale_management_system
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;
USE point_of_sale_management_system;

-- Create table for User_Role
CREATE TABLE User_Role (
    role_id VARCHAR(255) PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

INSERT INTO User_Role (role_id, role_name) VALUES
('ROLE001', 'เจ้าของร้าน'),
('ROLE002', 'แคชเชียร์'),
('ROLE003', 'ลูกค้า');

-- Create table for Users
CREATE TABLE Users (
    member_id VARCHAR(255) PRIMARY KEY,
    role_id VARCHAR(255) NOT NULL,
    member_firstname VARCHAR(255) NOT NULL,
    member_lastname VARCHAR(255) NOT NULL,
    member_username VARCHAR(255) NOT NULL,
    member_password VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    member_email_activate VARCHAR(255) NOT NULL,
    member_tel VARCHAR(255) NOT NULL,
    member_time_register VARCHAR(255) NOT NULL,
    member_time_login VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES User_Role(role_id)
);

-- Create table for Payment_Options
CREATE TABLE Payment_Options (
    pay_id VARCHAR(255) NOT NULL PRIMARY KEY,
    pay_cat_name VARCHAR(255) NOT NULL,
    pay_bank_name VARCHAR(255) NOT NULL,
    pay_bank_account_name VARCHAR(255) NOT NULL,
    pay_bank_number VARCHAR(255) NOT NULL,
    pay_status VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Categories_Main
CREATE TABLE Categories (
    cat_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cat_name_main VARCHAR(255) NOT NULL,
    cat_name_sub VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Products
CREATE TABLE Products (
    product_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cat_id VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    product_unit_number VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES Categories(cat_id)
);

-- Create table for Cart_Orders
CREATE TABLE Cart_Orders (
    cart_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cashier_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    cart_product_qty INT NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cashier_id) REFERENCES Users(member_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create table for Orders
CREATE TABLE Orders (
    order_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cashier_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    pay_id VARCHAR(255) NOT NULL,
    total_unit INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    member_discount DECIMAL(10, 2) NOT NULL,
    net_total DECIMAL(10, 2) NOT NULL,
    get_money DECIMAL(10, 2) NOT NULL,
    change_money DECIMAL(10, 2) NOT NULL,
    order_time_transaction VARCHAR(255) NOT NULL,
    order_time_payment VARCHAR(255) NOT NULL,
    oapp_image VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pay_id) REFERENCES Payment_Options(pay_id)
);

-- Create table for Order_Product_Lists
CREATE TABLE Order_Product_Lists (
    order_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    cart_product_qty INT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    cat_name_main VARCHAR(255) NOT NULL,
    cat_name_sub VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, product_name),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Create table for User_Role
CREATE TABLE Systen_Settings (
    store_name VARCHAR(255) NOT NULL PRIMARY KEY,
    store_description TEXT NOT NULL,
    store_categorie VARCHAR(255) NOT NULL,
    store_categorie_custom VARCHAR(255) NOT NULL,
    day_open_1 VARCHAR(255) NOT NULL,
    time_open_1 VARCHAR(255) NOT NULL,
    time_close_1 VARCHAR(255) NOT NULL,
    day_open_2 VARCHAR(255) NOT NULL,
    time_open_2 VARCHAR(255) NOT NULL,
    time_close_2 VARCHAR(255) NOT NULL,
    day_open_3 VARCHAR(255) NOT NULL,
    time_open_3 VARCHAR(255) NOT NULL,
    time_close_3 VARCHAR(255) NOT NULL,
    day_open_4 VARCHAR(255) NOT NULL,
    time_open_4 VARCHAR(255) NOT NULL,
    time_close_4 VARCHAR(255) NOT NULL,
    day_open_5 VARCHAR(255) NOT NULL,
    time_open_5 VARCHAR(255) NOT NULL,
    time_close_5 VARCHAR(255) NOT NULL,
    day_open_6 VARCHAR(255) NOT NULL,
    time_open_6 VARCHAR(255) NOT NULL,
    time_close_6 VARCHAR(255) NOT NULL,
    day_open_7 VARCHAR(255) NOT NULL,
    time_open_7 VARCHAR(255) NOT NULL,
    time_close_7 VARCHAR(255) NOT NULL,
    map_iframe_api TEXT NOT NULL,
    customer_discount VARCHAR(255) NOT NULL,
    customer_discount_custom VARCHAR(255) NOT NULL,
    privacy_policy TEXT NOT NULL,
    terms_and_conditions TEXT NOT NULL,
    cookie TEXT NOT NULL,
    text_footer VARCHAR(255) NOT NULL,
    mail_name VARCHAR(255) NOT NULL,
    mail_auto_sent VARCHAR(255) NOT NULL,
    mail_app_password VARCHAR(255) NOT NULL
);
