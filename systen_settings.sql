-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 24, 2024 at 03:47 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `point_of_sale_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `systen_settings`
--

CREATE TABLE `systen_settings` (
  `store_name` varchar(255) NOT NULL,
  `store_description` text NOT NULL,
  `store_categorie` varchar(255) NOT NULL,
  `day_open_1` varchar(255) NOT NULL,
  `time_open_1` varchar(255) NOT NULL,
  `time_close_1` varchar(255) NOT NULL,
  `day_open_2` varchar(255) NOT NULL,
  `time_open_2` varchar(255) NOT NULL,
  `time_close_2` varchar(255) NOT NULL,
  `day_open_3` varchar(255) NOT NULL,
  `time_open_3` varchar(255) NOT NULL,
  `time_close_3` varchar(255) NOT NULL,
  `day_open_4` varchar(255) NOT NULL,
  `time_open_4` varchar(255) NOT NULL,
  `time_close_4` varchar(255) NOT NULL,
  `day_open_5` varchar(255) NOT NULL,
  `time_open_5` varchar(255) NOT NULL,
  `time_close_5` varchar(255) NOT NULL,
  `day_open_6` varchar(255) NOT NULL,
  `time_open_6` varchar(255) NOT NULL,
  `time_close_6` varchar(255) NOT NULL,
  `day_open_7` varchar(255) NOT NULL,
  `time_open_7` varchar(255) NOT NULL,
  `time_close_7` varchar(255) NOT NULL,
  `map_iframe_api` text NOT NULL,
  `customer_discount` varchar(255) NOT NULL,
  `privacy_policy` text NOT NULL,
  `terms_and_conditions` text NOT NULL,
  `cookie` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `systen_settings`
--

INSERT INTO `systen_settings` (`store_name`, `store_description`, `store_categorie`, `day_open_1`, `time_open_1`, `time_close_1`, `day_open_2`, `time_open_2`, `time_close_2`, `day_open_3`, `time_open_3`, `time_close_3`, `day_open_4`, `time_open_4`, `time_close_4`, `day_open_5`, `time_open_5`, `time_close_5`, `day_open_6`, `time_open_6`, `time_close_6`, `day_open_7`, `time_open_7`, `time_close_7`, `map_iframe_api`, `customer_discount`, `privacy_policy`, `terms_and_conditions`, `cookie`) VALUES
('ไม่ระบุ', 'ไม่ระบุ', 'ไม่ระบุ', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', 'เปิดทำการ', '06:00', '21:00', '', '0.01', '<p class=\"\">เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลของคุณ ข้อมูลส่วนบุคคลที่เรารวบรวมจะถูกใช้เพื่อการปรับปรุงบริการและการประมวลผลคำสั่งซื้อของคุณเท่านั้น เราจะไม่แบ่งปันข้อมูลของคุณกับบุคคลที่สามโดยไม่ได้รับความยินยอมจากคุณ หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวของเรา โปรดติดต่อเราได้ตลอดเวลา</p>', '<p>การเข้าถึงและการใช้บริการของเว็บไซต์นี้ คุณยอมรับที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขที่ระบุไว้ เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือปรับปรุงข้อกำหนดเหล่านี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า กรุณาอ่านข้อกำหนดและเงื่อนไขให้ละเอียดก่อนใช้บริการ</p><p><b>คำจำกัดความ</b><br>(ผู้ให้บริการ) หมายถึง เจ้าของระบบ<br>(ผู้ใช้งาน) หมายถึง ร้านค้า และ ลูกค้า</p><p><b>1. การสมัครและการเข้าถึงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องทำการสมัครสมาชิกและได้รับการอนุมัติจากผู้ดูแลระบบก่อนที่จะสามารถเข้าถึงและใช้ระบบ Point Of Sale Management System (POSMS) ได้&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p><p><b>2. การใช้งานระบบ<br></b><span style=\"font-size: 1rem;\">ระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;นี้มีไว้สำหรับการบันทึกการซื้อขาย การจัดการสินค้า และการจัดการข้อมูลลูกค้าเท่านั้น ห้ามใช้ระบบในทางที่ผิดกฎหมายหรือผิดศีลธรรม&nbsp;</span><span style=\"font-size: 1rem;\">ข้อมูลที่บันทึกในระบบจะต้องเป็นข้อมูลที่ถูกต้องและครบถ้วน เพื่อให้ระบบสามารถทำงานได้อย่างมีประสิทธิภาพ</span></p><p><b>3. ความรับผิดชอบของผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ใช้งานต้องรับผิดชอบต่อการกระทำใดๆ ที่เกิดขึ้นจากการใช้บัญชีของตนเอง รวมถึงการทำธุรกรรมและการบันทึกข้อมูลต่างๆ ในระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">หากเกิดความเสียหายจากการใช้ระบบที่ไม่ถูกต้อง ผู้ใช้งานอาจต้องรับผิดชอบต่อความเสียหายที่เกิดขึ้น</span></p><p><b>4. การบำรุงรักษาและการปรับปรุงระบบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;มีสิทธิ์ในการบำรุงรักษา ปรับปรุง หรือแก้ไขระบบ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า ทั้งนี้เพื่อปรับปรุงการทำงานของระบบหรือเพื่อความปลอดภัย&nbsp;</span><span style=\"font-size: 1rem;\">ในกรณีที่ระบบต้องหยุดทำงานเพื่อการบำรุงรักษา ผู้ใช้งานจะได้รับแจ้งล่วงหน้า (ยกเว้นกรณีเร่งด่วน)</span></p><p><b>5. การปิดบัญชีผู้ใช้งาน<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการมีสิทธิ์ในการปิดบัญชีผู้ใช้งาน หากพบว่ามีการละเมิดข้อกำหนดและเงื่อนไข หรือใช้ระบบในทางที่ผิดกฎหมาย&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานสามารถขอปิดบัญชีของตนเองได้โดยแจ้งต่อผู้ดูแลระบบ</span></p><p><b>6. การจำกัดความรับผิดชอบ<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการจะไม่รับผิดชอบต่อความเสียหายหรือความสูญเสียใดๆ ที่เกิดขึ้นจากการใช้งานระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;รวมถึงการสูญหายของข้อมูล การไม่สามารถใช้งานระบบได้ หรือข้อผิดพลาดในการทำงานของระบบ</span></p><p><b>7. การแก้ไขข้อกำหนดและเงื่อนไข<br></b><span style=\"font-size: 1rem;\">ผู้ให้บริการขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้ตามที่เห็นสมควร โดยจะแจ้งให้ผู้ใช้งานทราบผ่านทางระบบ&nbsp;</span>Point Of Sale Management System (POSMS)<span style=\"font-size: 1rem;\">&nbsp;หรือวิธีการอื่นๆ</span><span style=\"font-size: 1rem;\">&nbsp;</span><span style=\"font-size: 1rem;\">ผู้ใช้งานจะต้องเก็บรักษาข้อมูลการเข้าสู่ระบบ&nbsp;</span>คือ Username (ชื่อผู้ใช้) และ Password (รหัสผ่าน) เป็นความลับ<span style=\"font-size: 1rem;\">&nbsp;และไม่ควรเปิดเผยแก่บุคคลที่สาม หากพบว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ผู้ใช้งานต้องแจ้งให้ผู้ดูแลระบบทราบทันที</span></p>', '<p class=\"\">เว็บไซต์ของเราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ คุกกี้ช่วยให้เราจดจำการตั้งค่าของคุณและปรับปรุงบริการตามที่คุณต้องการ คุณสามารถเลือกปิดการใช้คุกกี้ได้ในเบราว์เซอร์ของคุณ แต่การปิดคุกกี้อาจทำให้บางส่วนของเว็บไซต์ทำงานไม่สมบูรณ์</p>');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `systen_settings`
--
ALTER TABLE `systen_settings`
  ADD PRIMARY KEY (`store_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
