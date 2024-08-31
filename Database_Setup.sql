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
('ROLE001', 'เจ้าของร้าน - Shop Owner'),
('ROLE002', 'แคชเชียร์ - Cashier'),
('ROLE003', 'ลูกค้า - Customer');

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
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `users` (`member_id`, `role_id`, `member_firstname`, `member_lastname`, `member_username`, `member_password`, `member_tel`, `member_time_register`, `member_time_login`, `time_order`) VALUES
('MB1131347521', 'ROLE001', 'ศักดา', 'สุขขวัญ', 'sakdar.s@pos', 'sakdar.s@pos', '0980755735', '14 มิ.ย. 2567 11:27:50', '16 ส.ค. 2567 20:51:50', '2024-06-14 11:27:50'),
('MB2027027573', 'ROLE003', 'กัญญารัตน์', 'สินเจริญ', 'kanyarat.s@pos', 'kanyarat.s@pos', '0659985125', '14 มิ.ย. 2567 12:12:47', '14 มิ.ย. 2567 12:12:47', '2024-06-14 12:12:47'),
('MB2248769214', 'ROLE002', 'ชรินทร์รัตน์', 'สุวรรณรัตน์', 'charinrat.s@pos', 'charinrat.s@pos', '0956547895', '14 มิ.ย. 2567 12:10:26', '15 ส.ค. 2567 10:47:49', '2024-06-14 12:10:26'),
('MB2335127573', 'ROLE002', 'พรประภา', 'กำจัดภัย', 'pornpapar.g@pos', 'pornpapar.g@pos', '0657874595', '14 มิ.ย. 2567 11:51:01', '14 มิ.ย. 2567 11:51:01', '2024-06-14 11:51:01'),
('MB2357696365', 'ROLE002', 'บัวชมพู', 'รัตนา', 'buachompuu.r@pos', 'buachompuu.r@pos', '0746542355', '14 มิ.ย. 2567 12:08:23', '14 มิ.ย. 2567 12:08:23', '2024-06-14 12:08:23'),
('MB2976892258', 'ROLE003', 'แพรวา', 'ธรรมรัตน์', 'parewa.t@pos', 'parewa.t@pos', '0634562566', '14 มิ.ย. 2567 18:37:42', '17 ส.ค. 2567 15:50:34', '2024-06-14 18:37:42'),
('MB3088654056', 'ROLE002', 'อัมรินทร์', 'สุวรรณชาติ', 'aummarin.s@pos', 'aummarin.s@pos', '0453331234', '10 ก.ค. 2567 09:51:46', '10 ก.ค. 2567 09:51:46', '2024-07-10 10:17:50'),
('MB3466477454', 'ROLE003', 'พรอย', 'ชมพู', 'ploy.c@pos', 'ploy.c@pos', '0976541235', '15 มิ.ย. 2567 09:07:09', '15 มิ.ย. 2567 09:07:09', '2024-06-15 09:07:09'),
('MB4444903325', 'ROLE002', 'นริศรา', 'สิงค์ดา', 'naritsara.s@pos', 'naritsara.s@pos', '0654836545', '14 มิ.ย. 2567 11:32:19', '5 ส.ค. 2567 08:52:22', '2024-06-14 11:32:19'),
('MB5862619314', 'ROLE002', 'แพรพลอย', 'เกษมสุข', 'prawploy.k@pos', 'prawploy.k@pos', '0994551234', '9 ก.ค. 2567 17:23:17', '9 ก.ค. 2567 17:23:17', '2024-07-09 17:23:17'),
('MB5864308660', 'ROLE003', 'ปรียาภรณ์', 'สุขสวัสดิ์', 'preyaporn.s@pos', 'preyaporn.s@pos', '0875456523', '14 มิ.ย. 2567 13:18:30', '14 มิ.ย. 2567 13:18:30', '2024-06-14 13:18:30'),
('MB6176927131', 'ROLE003', 'ธัญญ์นรี', 'บุญประเสริฐ', 'tannare.b@pos', 'tannare.b@pos', '0843654565', '14 มิ.ย. 2567 13:17:29', '14 มิ.ย. 2567 13:17:29', '2024-06-14 13:17:29'),
('MB8434964444', 'ROLE003', 'ศิริพร', 'จันทร์เพ็ญ', 'siriporn.j@pos', 'siriporn.j@pos', '0456544554', '15 มิ.ย. 2567 10:27:22', '15 มิ.ย. 2567 10:27:22', '2024-06-15 10:27:22'),
('MB9033093141', 'ROLE003', 'สุดารัตน์', 'วงศ์วรวิทย์', 'sudarat.v@pos', 'sudarat.v@pos', '0951112223', '10 ก.ค. 2567 16:47:50', '5 ส.ค. 2567 11:18:35', '2024-07-10 19:05:39'),
('MB9141185012', 'ROLE003', 'ญาดา', 'นวลพรรณ', 'yada.n@pos', 'yada.n@pos', '0643554568', '14 มิ.ย. 2567 12:30:30', '14 มิ.ย. 2567 12:30:30', '2024-06-14 12:30:30'),
('MB9288107054', 'ROLE003', 'ชนากานต์', 'อินทรชัย', 'chanakan.e@pos', 'chanakan.e@pos', '0745456544', '14 มิ.ย. 2567 12:29:45', '14 มิ.ย. 2567 12:29:45', '2024-06-14 12:29:45');

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

INSERT INTO `payment_options` (`pay_id`, `pay_cat_name`, `pay_bank_name`, `pay_bank_account_name`, `pay_bank_number`, `pay_status`, `time_order`) VALUES
('PA3559307879', 'OPT1', 'เงินสด', 'เงินสด', 'เงินสด', '1', '2024-07-13 18:20:57'),
('PA6246355887', 'OPT2', 'ธ.กรุงไทย จำกัด (มหาชน)', 'นายศักดา สุขขวัญ', '9150367897', '1', '2024-07-13 18:21:44'),
('PA8746709900', 'OPT3', 'QR Prompt Pay', 'นายศักดา สุขขวัญ', '0980755735', '1', '2024-07-13 18:32:18');

-- Create table for Categories_Main
CREATE TABLE Categories_Main (
    cat_main_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cat_main_name VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Categories_Sub
CREATE TABLE Categories_Sub (
    cat_sub_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cat_sub_name VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Products
CREATE TABLE Products (
    product_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cat_id VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Cart_Orders
CREATE TABLE Cart_Orders (
    cart_id VARCHAR(255) NOT NULL PRIMARY KEY,
    cashier_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    cart_product_qty INT NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Order_Product_Lists
CREATE TABLE Order_Product_Lists (
    order_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    cart_product_qty INT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    cat_main_name VARCHAR(255) NOT NULL,
    cat_sub_name VARCHAR(255) NOT NULL,
    time_order DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, product_name)
);

-- Create table for Systen_Settings
CREATE TABLE Systen_Settings (
    store_name VARCHAR(255) NOT NULL PRIMARY KEY,
    store_description TEXT NOT NULL,
    store_categorie VARCHAR(255) NOT NULL,
    store_categorie_custom VARCHAR(255) NOT NULL,
    login_time_out VARCHAR(255) NOT NULL,
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
    cookie TEXT NOT NULL
);

INSERT INTO `systen_settings` (`store_name`, `store_description`, `store_categorie`, `store_categorie_custom`, `login_time_out`, `day_open_1`, `time_open_1`, `time_close_1`, `day_open_2`, `time_open_2`, `time_close_2`, `day_open_3`, `time_open_3`, `time_close_3`, `day_open_4`, `time_open_4`, `time_close_4`, `day_open_5`, `time_open_5`, `time_close_5`, `day_open_6`, `time_open_6`, `time_close_6`, `day_open_7`, `time_open_7`, `time_close_7`, `map_iframe_api`, `customer_discount`, `customer_discount_custom`, `privacy_policy`, `terms_and_conditions`, `cookie`) VALUES
('ร้านเกมส์มินิมาร์ท', '<h1 align=\"center\" style=\"font-family: &quot;Bai Jamjuree&quot;, sans-serif; color: rgb(51, 51, 51);\"><a href=\"https://github.com/newzydev/Point-Of-Sale-Management-System-NodeJS-Express-EJS\" target=\"_blank\" style=\"color: rgb(0, 86, 179);\">Point Of Sale Management System</a></h1><hr><h3 class=\"\" style=\"text-align: center; \">การติดตั้งแอปพลิเคชัน</h3><p style=\"text-align: center; \" class=\"\"><span style=\"font-size: 1rem; text-align: left;\"><b>1. สำหรับ Windows / Mac</b></span></p><p style=\"text-align: center; \" class=\"\"><span style=\"font-size: 1rem; text-align: left;\">ขั้นตอน : กดปุ่มติดตั้งแอปพลิเคชัน หรือกดไอคอนติดตั้งบนแท็บ</span></p><p style=\"text-align: center; \" class=\"\"><span style=\"font-size: 1rem; text-align: left;\"><b>2. สำหรับ Android</b></span></p><p style=\"text-align: center; \" class=\"\"><span style=\"font-size: 1rem; text-align: left;\">ขั้นตอน :&nbsp;</span><span style=\"text-align: left;\">Google Chrome จะแสดงป๊อปอัพ \"Add to Home Screen\" โดยอัตโนมัติ หรือ&nbsp;</span><span style=\"text-align: left;\">กดปุ่มเมนู (สามจุด) แล้วเลือก \"Add to Home Screen\"</span></p><p style=\"text-align: center; \" class=\"\"><span style=\"text-align: left;\"><b>3. สำหรับ IOS</b></span></p><p style=\"text-align: center; \" class=\"\"><span style=\"text-align: left;\">ขั้นตอน :&nbsp;</span><span style=\"text-align: left;\">กดปุ่ม \"Share\" (ไอคอนที่มีลูกศรขึ้นจากกล่อง) แล้วเลือก \"Add to Home Screen\"</span></p><hr><h1 align=\"center\" style=\"font-family: &quot;Bai Jamjuree&quot;, sans-serif; color: rgb(51, 51, 51);\"><span style=\"font-family: inherit; color: inherit; font-size: 1.75rem; text-align: left;\">Develop with language :</span><br></h1><p align=\"center\"><img src=\"https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&amp;logo=node.js&amp;logoColor=white\" alt=\"Node.js\">&nbsp;<img src=\"https://img.shields.io/badge/Express-000000?style=for-the-badge&amp;logo=express&amp;logoColor=white\" alt=\"Express\">&nbsp;<img src=\"https://img.shields.io/badge/EJS-555555?style=for-the-badge&amp;logo=ejs&amp;logoColor=white\" alt=\"EJS\">&nbsp;<img src=\"https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&amp;logo=html5&amp;logoColor=white\" alt=\"HTML5\">&nbsp;<img src=\"https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&amp;logo=css3&amp;logoColor=white\" alt=\"CSS3\">&nbsp;<img src=\"https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black\" alt=\"JavaScript\">&nbsp;<img src=\"https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&amp;logo=mysql&amp;logoColor=white\" alt=\"MySQL\"></p><h3 align=\"center\" style=\"font-family: &quot;Bai Jamjuree&quot;, sans-serif; color: rgb(51, 51, 51);\">Developer : Sakdar Sukkwan</h3><p align=\"center\"><a href=\"https://www.facebook.com/ss.newzy/\"><img src=\"https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&amp;logo=facebook&amp;logoColor=white\" alt=\"Facebook\">&nbsp;</a><a href=\"https://www.instagram.com/ss.newzy/\"><img src=\"https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&amp;logo=instagram&amp;logoColor=white\" alt=\"Instagram\">&nbsp;</a><a href=\"https://www.twitch.tv/newzydev\"><img src=\"https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&amp;logo=twitch&amp;logoColor=white\" alt=\"Twitch\"></a></p><p align=\"center\"><a href=\"https://www.twitch.tv/newzydev\"></a></p>', 'Other', 'ร้ายขายของชำ', '7d', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3959.726753096585!2d100.55177423331297!3d7.0413642252143065!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d2b81c83824cd%3A0xc7197821308ba397!2z4LmA4LiB4Lih4Liq4LmM4Lih4Li04LiZ4Li04Lih4Liy4Lij4LmM4LiX!5e0!3m2!1sth!2sth!4v1724321725919!5m2!1sth!2sth', 'Other', '8', '<p class=\"\">เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลของคุณ ข้อมูลส่วนบุคคลที่เรารวบรวมจะถูกใช้เพื่อการปรับปรุงบริการและการประมวลผลคำสั่งซื้อของคุณเท่านั้น เราจะไม่แบ่งปันข้อมูลของคุณกับบุคคลที่สามโดยไม่ได้รับความยินยอมจากคุณ หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวของเรา โปรดติดต่อเราได้ตลอดเวลา</p>', '<p>การเข้าถึงและการใช้บริการของเว็บไซต์นี้ คุณยอมรับที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือปรับปรุงข้อกำหนดเหล่านี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า กรุณาอ่านข้อกำหนดและเงื่อนไขให้ละเอียดก่อนใช้บริการ</p><p><b>คำจำกัดความ</b><br>(ผู้ให้บริการ) หมายถึง เจ้าของระบบ<br>(ผู้ใช้งาน) หมายถึง ร้านค้า และ ลูกค้า</p><p><b>1. การสมัครและการเข้าถึงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องทำการสมัครสมาชิกและได้รับการอนุมัติจากผู้ดูแลระบบก่อนที่จะสามารถเข้าถึงและใช้ระบบ Point Of Sale Management System (POSMS) ได้&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p><p><b>2. การใช้งานระบบ<br></b><span style=\"font-size: 1rem;\">ระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;นี้มีไว้สำหรับการบันทึกการซื้อขาย การจัดการสินค้า และการจัดการข้อมูลลูกค้าเท่านั้น ห้ามใช้ระบบในทางที่ผิดกฎหมายหรือผิดศีลธรรม&nbsp;</span><span style=\"font-size: 1rem;\">ข้อมูลที่บันทึกในระบบจะต้องเป็นข้อมูลที่ถูกต้องและครบถ้วน เพื่อให้ระบบสามารถทำงานได้อย่างมีประสิทธิภาพ</span></p><p><b>3. ความรับผิดชอบของผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานต้องรับผิดชอบต่อการกระทำใดๆ ที่เกิดขึ้นจากการใช้บัญชีของตนเอง รวมถึงการทำธุรกรรมและการบันทึกข้อมูลต่างๆ ในระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">หากเกิดความเสียหายจากการใช้ระบบที่ไม่ถูกต้อง ผู้ใช้งานอาจต้องรับผิดชอบต่อความเสียหายที่เกิดขึ้น</span></p><p><b>4. การบำรุงรักษาและการปรับปรุงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;มีสิทธิ์ในการบำรุงรักษา ปรับปรุง หรือแก้ไขระบบ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า ทั้งนี้เพื่อปรับปรุงการทำงานของระบบหรือเพื่อความปลอดภัย&nbsp;</span><span style=\"font-size: 1rem;\">ในกรณีที่ระบบต้องหยุดทำงานเพื่อการบำรุงรักษา ผู้ใช้งานจะได้รับแจ้งล่วงหน้า (ยกเว้นกรณีเร่งด่วน)</span></p><p><b>5. การปิดบัญชีผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการมีสิทธิ์ในการปิดบัญชีผู้ใช้งาน หากพบว่ามีการละเมิดข้อกำหนดและเงื่อนไข หรือใช้ระบบในทางที่ผิดกฎหมาย&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานสามารถขอปิดบัญชีของตนเองได้โดยแจ้งต่อผู้ดูแลระบบ</span></p><p><b>6. การจำกัดความรับผิดชอบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการจะไม่รับผิดชอบต่อความเสียหายหรือความสูญเสียใดๆ ที่เกิดขึ้นจากการใช้งานระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;รวมถึงการสูญหายของข้อมูล การไม่สามารถใช้งานระบบได้ หรือข้อผิดพลาดในการทำงานของระบบ</span></p><p><b>7. การแก้ไขข้อกำหนดและเงื่อนไข<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้ตามที่เห็นสมควร โดยจะแจ้งให้ผู้ใช้งานทราบผ่านทางระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;หรือวิธีการอื่นๆ</span><span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ&nbsp;</span>คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ<span style=\"font-size: 1rem;\">&nbsp;และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p>', '<p class=\"\">เว็บไซต์ของเราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ คุกกี้ช่วยให้เราจดจำการตั้งค่าของคุณและปรับปรุงบริการตามที่คุณต้องการ คุณสามารถเลือกปิดการใช้คุกกี้ได้ในเบราว์เซอร์ของคุณ แต่การปิดคุกกี้อาจทำให้บางส่วนของเว็บไซต์ทำงานไม่สมบูรณ์</p>');
