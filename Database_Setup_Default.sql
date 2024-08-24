-- Database Store Name : Default

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
('ROLE001', 'เจ้าของร้าน / Shop Owner'),
('ROLE002', 'แคชเชียร์ / Cashier'),
('ROLE003', 'ลูกค้า / Customer');

-- Create table for Users
CREATE TABLE Users (
    member_id VARCHAR(255) PRIMARY KEY,
    role_id VARCHAR(255) NOT NULL,
    member_firstname VARCHAR(255) NOT NULL,
    member_lastname VARCHAR(255) NOT NULL,
    member_username VARCHAR(255) NOT NULL,
    member_password VARCHAR(255) NOT NULL,
    member_tel VARCHAR(255) NOT NULL,
    member_time_register VARCHAR(255) NOT NULL,
    member_time_login VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES User_Role(role_id)
);

INSERT INTO `users` (`member_id`, `role_id`, `member_firstname`, `member_lastname`, `member_username`, `member_password`, `member_tel`, `member_time_register`, `member_time_login`, `time_order`) VALUES
('MB1131347521', 'ROLE001', 'เจ้าของร้าน', 'เจ้าของร้าน', 'admin@pos', 'admin@pos', '0989999999', '14 มิ.ย. 2567 11:27:50', '16 ส.ค. 2567 20:51:50', '2024-06-14 11:27:50'),

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
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pay_id) REFERENCES Payment_Options(pay_id)
);

-- Create table for Order_Product_Lists
CREATE TABLE Order_Product_Lists (
    order_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    cart_product_qty INT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, product_name),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- Create table for User_Role
CREATE TABLE Systen_Settings (
    store_name VARCHAR(255) NOT NULL PRIMARY KEY,
    store_description TEXT NOT NULL,
    store_categorie VARCHAR(255) NOT NULL,
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
    privacy_policy TEXT NOT NULL,
    terms_and_conditions TEXT NOT NULL,
    cookie TEXT NOT NULL
);

INSERT INTO `systen_settings` (`store_name`, `store_description`, `store_categorie`, `day_open_1`, `time_open_1`, `time_close_1`, `day_open_2`, `time_open_2`, `time_close_2`, `day_open_3`, `time_open_3`, `time_close_3`, `day_open_4`, `time_open_4`, `time_close_4`, `day_open_5`, `time_open_5`, `time_close_5`, `day_open_6`, `time_open_6`, `time_close_6`, `day_open_7`, `time_open_7`, `time_close_7`, `map_iframe_api`, `customer_discount`, `privacy_policy`, `terms_and_conditions`, `cookie`) VALUES
('ไม่ระบุ', 'ไม่ระบุ', 'ไม่ระบุ', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', '', '0.01', '<p class=\"\">เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลของคุณ ข้อมูลส่วนบุคคลที่เรารวบรวมจะถูกใช้เพื่อการปรับปรุงบริการและการประมวลผลคำสั่งซื้อของคุณเท่านั้น เราจะไม่แบ่งปันข้อมูลของคุณกับบุคคลที่สามโดยไม่ได้รับความยินยอมจากคุณ หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวของเรา โปรดติดต่อเราได้ตลอดเวลา</p>', '<p>การเข้าถึงและการใช้บริการของเว็บไซต์นี้ คุณยอมรับที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือปรับปรุงข้อกำหนดเหล่านี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า กรุณาอ่านข้อกำหนดและเงื่อนไขให้ละเอียดก่อนใช้บริการ</p><p><b>คำจำกัดความ</b><br>(ผู้ให้บริการ) หมายถึง เจ้าของระบบ<br>(ผู้ใช้งาน) หมายถึง ร้านค้า และ ลูกค้า</p><p><b>1. การสมัครและการเข้าถึงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องทำการสมัครสมาชิกและได้รับการอนุมัติจากผู้ดูแลระบบก่อนที่จะสามารถเข้าถึงและใช้ระบบ Point Of Sale Management System (POSMS) ได้&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p><p><b>2. การใช้งานระบบ<br></b><span style=\"font-size: 1rem;\">ระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;นี้มีไว้สำหรับการบันทึกการซื้อขาย การจัดการสินค้า และการจัดการข้อมูลลูกค้าเท่านั้น ห้ามใช้ระบบในทางที่ผิดกฎหมายหรือผิดศีลธรรม&nbsp;</span><span style=\"font-size: 1rem;\">ข้อมูลที่บันทึกในระบบจะต้องเป็นข้อมูลที่ถูกต้องและครบถ้วน เพื่อให้ระบบสามารถทำงานได้อย่างมีประสิทธิภาพ</span></p><p><b>3. ความรับผิดชอบของผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานต้องรับผิดชอบต่อการกระทำใดๆ ที่เกิดขึ้นจากการใช้บัญชีของตนเอง รวมถึงการทำธุรกรรมและการบันทึกข้อมูลต่างๆ ในระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">หากเกิดความเสียหายจากการใช้ระบบที่ไม่ถูกต้อง ผู้ใช้งานอาจต้องรับผิดชอบต่อความเสียหายที่เกิดขึ้น</span></p><p><b>4. การบำรุงรักษาและการปรับปรุงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;มีสิทธิ์ในการบำรุงรักษา ปรับปรุง หรือแก้ไขระบบ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า ทั้งนี้เพื่อปรับปรุงการทำงานของระบบหรือเพื่อความปลอดภัย&nbsp;</span><span style=\"font-size: 1rem;\">ในกรณีที่ระบบต้องหยุดทำงานเพื่อการบำรุงรักษา ผู้ใช้งานจะได้รับแจ้งล่วงหน้า (ยกเว้นกรณีเร่งด่วน)</span></p><p><b>5. การปิดบัญชีผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการมีสิทธิ์ในการปิดบัญชีผู้ใช้งาน หากพบว่ามีการละเมิดข้อกำหนดและเงื่อนไข หรือใช้ระบบในทางที่ผิดกฎหมาย&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานสามารถขอปิดบัญชีของตนเองได้โดยแจ้งต่อผู้ดูแลระบบ</span></p><p><b>6. การจำกัดความรับผิดชอบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการจะไม่รับผิดชอบต่อความเสียหายหรือความสูญเสียใดๆ ที่เกิดขึ้นจากการใช้งานระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;รวมถึงการสูญหายของข้อมูล การไม่สามารถใช้งานระบบได้ หรือข้อผิดพลาดในการทำงานของระบบ</span></p><p><b>7. การแก้ไขข้อกำหนดและเงื่อนไข<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้ตามที่เห็นสมควร โดยจะแจ้งให้ผู้ใช้งานทราบผ่านทางระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;หรือวิธีการอื่นๆ</span><span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ&nbsp;</span>คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ<span style=\"font-size: 1rem;\">&nbsp;และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p>', '<p class=\"\">เว็บไซต์ของเราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ คุกกี้ช่วยให้เราจดจำการตั้งค่าของคุณและปรับปรุงบริการตามที่คุณต้องการ คุณสามารถเลือกปิดการใช้คุกกี้ได้ในเบราว์เซอร์ของคุณ แต่การปิดคุกกี้อาจทำให้บางส่วนของเว็บไซต์ทำงานไม่สมบูรณ์</p>');
