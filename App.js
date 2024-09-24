const express = require('express'); // นำเข้าโมดูล Express เพื่อใช้สร้างแอปพลิเคชันเว็บเซิร์ฟเวอร์
const bodyParser = require('body-parser'); // นำเข้าโมดูล body-parser เพื่อแปลงข้อมูลใน request body เป็น JSON หรือรูปแบบอื่น ๆ
const path = require('path'); // นำเข้าโมดูล path เพื่อจัดการเส้นทางของไฟล์และโฟลเดอร์ในระบบไฟล์
const QRCode = require('qrcode'); // นำเข้าโมดูล qrcode เพื่อสร้าง QR Code จากข้อความที่กำหนด
const flash = require('connect-flash'); // นำเข้าโมดูล connect-flash เพื่อใช้จัดการข้อความการแจ้งเตือน (flash messages)
const cookieParser = require('cookie-parser'); // นำเข้าโมดูล cookie-parser เพื่อจัดการคุกกี้ใน request และ response
const session = require('express-session'); // นำเข้าโมดูล express-session เพื่อจัดการ session ของผู้ใช้
const connectDB = require('./Config/db'); // นำเข้าโมดูลที่ใช้เชื่อมต่อกับฐานข้อมูล
const { authenticateUser, checkRole001, checkRole002, checkRole003 } = require('./Middlewares/auth'); // นำเข้า middleware สำหรับการยืนยันตัวตนและตรวจสอบสิทธิ์ของผู้ใช้
const SystemSettingsMiddleware = require('./Middlewares/setting'); // นำเข้า middleware สำหรับดึงข้อมูลการตั้งค่าของระบบ
const osMiddleware = require('./Middlewares/os'); // นำเข้า middleware สำหรับดึงข้อมูลเกี่ยวกับระบบปฏิบัติการ
const app = express(); // สร้างแอปพลิเคชัน Express

const port = 5000; // กำหนดหมายเลขพอร์ตที่แอปพลิเคชันจะฟังการเชื่อมต่อ
const db = connectDB(); // เชื่อมต่อกับฐานข้อมูลและเก็บไว้ในตัวแปร db
global.db = db; // กำหนดตัวแปร db ให้เป็น global เพื่อให้สามารถเข้าถึงได้จากทุกที่ในแอปพลิเคชัน

app.use(SystemSettingsMiddleware); // ใช้ middleware ที่ดึงข้อมูลการตั้งค่าของระบบในทุก request
app.use(osMiddleware); // ใช้ middleware ที่ดึงข้อมูลเกี่ยวกับระบบปฏิบัติการในทุก request
app.use(session({
    secret: 'ADMIN-DEV-POSMS', // กำหนดคีย์ลับสำหรับเข้ารหัสข้อมูล session
    resave: false, // ไม่บันทึก session หากไม่มีการเปลี่ยนแปลงข้อมูล
    saveUninitialized: false, // ไม่บันทึก session ที่ไม่ได้ถูกใช้งาน
    cookie: { 
        name: 'SESSION_TOKEN', // ตั้งชื่อคุกกี้สำหรับ session
        secure: false // กำหนดให้คุกกี้ไม่จำเป็นต้องใช้งานบน HTTPS
    } 
}));

const fileUpload = require('express-fileupload');

app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 }, // จำกัดขนาดไฟล์ที่ 25MB
    abortOnLimit: true, // ยกเลิกการอัปโหลดถ้าเกินขนาดที่กำหนด
    createParentPath: true // สร้างโฟลเดอร์ถ้ายังไม่มี
}));

app.use(flash('ADMIN-DEV-POSMS')); // ใช้ connect-flash สำหรับจัดการ flash messages
app.use(cookieParser('ADMIN-DEV-POSMS')); // ใช้ cookie-parser สำหรับจัดการคุกกี้ด้วยคีย์ลับ
app.set('port', process.env.port || port); // กำหนดหมายเลขพอร์ตให้แอปพลิเคชัน
app.set('views', path.join(__dirname, 'views')); // กำหนดเส้นทางไปยังโฟลเดอร์ views ที่เก็บไฟล์ template
app.set('view engine', 'ejs'); // กำหนดให้ใช้ EJS เป็น template engine
app.use(bodyParser.urlencoded({ extended: false })); // แปลงข้อมูลจาก request body ที่มีรูปแบบ url-encoded ให้เป็น object
app.use(bodyParser.json()); // แปลงข้อมูลจาก request body ที่เป็น JSON ให้เป็น object
app.use(express.static(path.join(__dirname, 'Public'))); // กำหนดเส้นทางให้บริการไฟล์สาธารณะ (เช่น ไฟล์ CSS, JS) จากโฟลเดอร์ Public
app.use('/assets', express.static(path.join(__dirname, 'Public/assets'))); // กำหนดเส้นทางเพิ่มเติมสำหรับไฟล์ในโฟลเดอร์ assets

app.get('/qrcode-gen', (req, res) => {
    const text = req.query.text; // ดึงค่าข้อความจาก query parameter 'text'
    if (!text) return res.status(400).send('Text query parameter is required'); // ตรวจสอบว่ามีการส่งค่า text มาหรือไม่ ถ้าไม่ส่งให้ตอบกลับด้วยสถานะ 400

    QRCode.toBuffer(text, (err, buffer) => { // สร้าง QR Code จากข้อความและแปลงเป็น buffer
        if (err) {
            console.error(err); // ถ้ามีข้อผิดพลาดในการสร้าง QR Code ให้แสดงข้อผิดพลาดใน console
            return res.status(500).send('Error generating QR code'); // ตอบกลับด้วยสถานะ 500 และข้อความแจ้งข้อผิดพลาด
        }
        res.setHeader('Content-Type', 'image/png'); // กำหนด header ให้ส่งไฟล์ประเภท PNG
        res.send(buffer); // ส่ง buffer ที่เป็น QR Code ให้กับ client
    });
});

// Route Imports
// Login Page
const { getLoginPage, postLogin } = require('./Routes/Login');
app.get('/', getLoginPage);
app.post('/', postLogin);

// Login Verify Page
const { getLoginVerifyPage, postLoginVerify } = require('./Routes/Login_Verify');
app.get('/Login_Verify/:member_id', getLoginVerifyPage);
app.post('/Login_Verify/:member_id', postLoginVerify);

// Logout Page
const { getLogoutPage } = require('./Routes/Logout');
app.get('/Logout', getLogoutPage);

// Register Page
const { getRegisterPage, postRegister } = require('./Routes/Register');
app.get('/Register', getRegisterPage);
app.post('/Register', postRegister);

// Account Register Activate Page
const { getRegisterActivatePage, postRegisterActivate } = require('./Routes/Account_Register_Activate');
app.get('/Account_Register_Activate/:member_id', getRegisterActivatePage);
app.post('/Account_Register_Activate/:member_id', postRegisterActivate);

// Forgot Account Page
const { getForgotAccountPage, postForgotAccount } = require('./Routes/Forgot_Account');
app.get('/Forgot_Account', getForgotAccountPage);
app.post('/Forgot_Account', postForgotAccount);

// Forgot Account Verify Page
const { getForgotAccountVerifyPage, postForgotAccountVerify } = require('./Routes/Forgot_Account_Verify');
app.get('/Forgot_Account/Forgot_Account_Verify/:member_id', getForgotAccountVerifyPage);
app.post('/Forgot_Account/Forgot_Account_Verify/:member_id', postForgotAccountVerify);

// ==================================================
// Role Shop_Owner
// ==================================================
// Profile Page
const { getShopOwnerProfilePage, postShopOwnerChangeProfile, postShopOwnerChangeEmail, postShopOwnerChangeUsername, postShopOwnerChangePassword } = require('./Routes/Role/Shop_Owner/Profile');
app.get('/Role/Shop_Owner/Page/Profile', authenticateUser(db), checkRole001, getShopOwnerProfilePage);
app.post('/Role/Shop_Owner/Page/Profile/ChangeProfile', authenticateUser(db), checkRole001, postShopOwnerChangeProfile);
app.post('/Role/Shop_Owner/Page/Profile/ChangeEmail', authenticateUser(db), checkRole001, postShopOwnerChangeEmail);
app.post('/Role/Shop_Owner/Page/Profile/ChangeUsername', authenticateUser(db), checkRole001, postShopOwnerChangeUsername);
app.post('/Role/Shop_Owner/Page/Profile/ChangePassword', authenticateUser(db), checkRole001, postShopOwnerChangePassword);

// Dashbord Page
const { getShopOwnerDashbordPage } = require('./Routes/Role/Shop_Owner/Dashbord');
app.get('/Role/Shop_Owner/Page/Dashbord', authenticateUser(db), checkRole001, getShopOwnerDashbordPage);

// Manage Employee Page
const { getManageEmployeePage } = require('./Routes/Role/Shop_Owner/Manage_Employee_Users');
const { getAddEmployeePage, postAddEmployee } = require('./Routes/Role/Shop_Owner/Add_Employee');
const { getViewEmployeePage } = require('./Routes/Role/Shop_Owner/View_Employee');
const { getEditEmployeePage, postEditEmployee } = require('./Routes/Role/Shop_Owner/Edit_Employee');
const { getDeleteEmployeePage } = require('./Routes/Role/Shop_Owner/Delete_Employee');
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users', authenticateUser(db), checkRole001, getManageEmployeePage);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Add_Employee', authenticateUser(db), checkRole001, getAddEmployeePage);
app.post('/Role/Shop_Owner/Page/Manage_Employee_Users/Add_Employee', authenticateUser(db), checkRole001, postAddEmployee);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/View/:member_id', authenticateUser(db), checkRole001, getViewEmployeePage);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/:member_id', authenticateUser(db), checkRole001, getEditEmployeePage);
app.post('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/:member_id', authenticateUser(db), checkRole001, postEditEmployee);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Delete/:member_id', authenticateUser(db), checkRole001, getDeleteEmployeePage);

// Manage Customer Page
const { getManageCustomerPage } = require('./Routes/Role/Shop_Owner/Manage_Customer_Users');
const { getAddCustomerPage, postAddCustomer } = require('./Routes/Role/Shop_Owner/Add_Customer');
const { getViewCustomerPage } = require('./Routes/Role/Shop_Owner/View_Customer');
const { getEditCustomerPage, postEditCustomer } = require('./Routes/Role/Shop_Owner/Edit_Customer');
const { getDeleteCustomerPage } = require('./Routes/Role/Shop_Owner/Delete_Customer');
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users', authenticateUser(db), checkRole001, getManageCustomerPage);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Add_Customer', authenticateUser(db), checkRole001, getAddCustomerPage);
app.post('/Role/Shop_Owner/Page/Manage_Customer_Users/Add_Customer', authenticateUser(db), checkRole001, postAddCustomer);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/View/:member_id', authenticateUser(db), checkRole001, getViewCustomerPage);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Edit/:member_id', authenticateUser(db), checkRole001, getEditCustomerPage);
app.post('/Role/Shop_Owner/Page/Manage_Customer_Users/Edit/:member_id', authenticateUser(db), checkRole001, postEditCustomer);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Delete/:member_id', authenticateUser(db), checkRole001, getDeleteCustomerPage);

// Manage Payment Methods Page
const { getManagePaymentMethodsPage } = require('./Routes/Role/Shop_Owner/Manage_Payment_Methods');
const { getAddPaymentMethodPage, postAddPaymentMethod } = require('./Routes/Role/Shop_Owner/Add_Payment_Method');
const { getViewPaymentMethodPage } = require('./Routes/Role/Shop_Owner/View_Payment_Method');
const { getEditPaymentMethodPage, postEditPaymentMethod } = require('./Routes/Role/Shop_Owner/Edit_Payment_Method');
const { getDeletePaymentMethodPage } = require('./Routes/Role/Shop_Owner/Delete_Payment_Method');
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods', authenticateUser(db), checkRole001, getManagePaymentMethodsPage);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method', authenticateUser(db), checkRole001, getAddPaymentMethodPage);
app.post('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method', authenticateUser(db), checkRole001, postAddPaymentMethod);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/View/:pay_id', authenticateUser(db), checkRole001, getViewPaymentMethodPage);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/:pay_id', authenticateUser(db), checkRole001, getEditPaymentMethodPage);
app.post('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/:pay_id', authenticateUser(db), checkRole001, postEditPaymentMethod);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Delete/:pay_id', authenticateUser(db), checkRole001, getDeletePaymentMethodPage);

// Sale Reports Page
const { getSaleReportsPage } = require('./Routes/Role/Shop_Owner/Sale_Reports');
const { getViewOrderRecieptPage } = require('./Routes/Role/Shop_Owner/View_Order_Receipt');
const { getSaleReportsPrintReportPage } = require('./Routes/Role/Shop_Owner/Print_Sale_Reports');
app.get('/Role/Shop_Owner/Page/Sale_Reports', authenticateUser(db), checkRole001, getSaleReportsPage);
app.get('/Role/Shop_Owner/Page/Sale_Reports/Order/:order_id', authenticateUser(db), checkRole001, getViewOrderRecieptPage);
app.get('/Role/Shop_Owner/Page/Sale_Reports/Print/Report', authenticateUser(db), checkRole001, getSaleReportsPrintReportPage);

// System Settings Page
const { getSystemSettingPage, postUpdateSettingsForm1, postUpdateSettingsForm2, postUpdateSettingsForm3, postUpdateSettingsForm4, postUpdateSettingsForm5, postUpdateSettingsForm6, postUpdateSettingsForm7 } = require('./Routes/Role/Shop_Owner/System_Settings');
app.get('/Role/Shop_Owner/Page/System_Settings', authenticateUser(db), checkRole001, getSystemSettingPage);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_1', authenticateUser(db), checkRole001, postUpdateSettingsForm1);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_2', authenticateUser(db), checkRole001, postUpdateSettingsForm2);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_3', authenticateUser(db), checkRole001, postUpdateSettingsForm3);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_4', authenticateUser(db), checkRole001, postUpdateSettingsForm4);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_5', authenticateUser(db), checkRole001, postUpdateSettingsForm5);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_6', authenticateUser(db), checkRole001, postUpdateSettingsForm6);
app.post('/Role/Shop_Owner/Page/System_Settings/Update_Settings_Form_7', authenticateUser(db), checkRole001, postUpdateSettingsForm7);

// ==================================================
// Role Cashier
// ==================================================
// Profile Page
const { getCashierProfilePage, postCashierChangeProfile, postCashierChangeEmail, postCashierChangeUsername, postCashierChangePassword } = require('./Routes/Role/Cashier/Profile');
app.get('/Role/Cashier/Page/Profile', authenticateUser(db), checkRole002, getCashierProfilePage);
app.post('/Role/Shop_Owner/Page/Profile/ChangeProfile', authenticateUser(db), checkRole001, postCashierChangeProfile);
app.post('/Role/Shop_Owner/Page/Profile/ChangeEmail', authenticateUser(db), checkRole001, postCashierChangeEmail);
app.post('/Role/Shop_Owner/Page/Profile/ChangeUsername', authenticateUser(db), checkRole001, postCashierChangeUsername);
app.post('/Role/Shop_Owner/Page/Profile/ChangePassword', authenticateUser(db), checkRole001, postCashierChangePassword);

// Manage Products Page
const { getManageProductsPage } = require('./Routes/Role/Cashier/Manage_Products');
const { getAddProductPage, getSubCategories, postAddProduct } = require('./Routes/Role/Cashier/Add_Product');
const { getViewProductPage } = require('./Routes/Role/Cashier/View_Product');
const { getEditProductPage, postEditProduct } = require('./Routes/Role/Cashier/Edit_Product');
const { getDeleteProductPage } = require('./Routes/Role/Cashier/Delete_Product');
const { getProductPrintLabelPage } = require('./Routes/Role/Cashier/Print_Product_Label');
const { getProductPrintLabelCustomPage } = require('./Routes/Role/Cashier/Print_Product_Label_Custom');
const { getProductPrintReportPage } = require('./Routes/Role/Cashier/Print_Product_Report');
app.get('/Role/Cashier/Page/Manage_Products', authenticateUser(db), checkRole002, getManageProductsPage);
app.get('/Role/Cashier/Page/Manage_Products/Add_Product', authenticateUser(db), checkRole002, getAddProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Add_Product/Get_Sub_Categories/:mainCategory', authenticateUser(db), checkRole002, getSubCategories);
app.post('/Role/Cashier/Page/Manage_Products/Add_Product', authenticateUser(db), checkRole002, postAddProduct);
app.get('/Role/Cashier/Page/Manage_Products/View/:product_id', authenticateUser(db), checkRole002, getViewProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Edit/:product_id', authenticateUser(db), checkRole002, getEditProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Edit_Product/Get_Sub_Categories/:mainCategory', authenticateUser(db), checkRole002, getSubCategories);
app.post('/Role/Cashier/Page/Manage_Products/Edit/:product_id', authenticateUser(db), checkRole002, postEditProduct);
app.get('/Role/Cashier/Page/Manage_Products/Delete/:product_id', authenticateUser(db), checkRole002, getDeleteProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Label', authenticateUser(db), checkRole002, getProductPrintLabelPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Label/Custom/:product_id', authenticateUser(db), checkRole002, getProductPrintLabelCustomPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Report', authenticateUser(db), checkRole002, getProductPrintReportPage);

// Manage Product Categories Page
const { getManageProductCategoriesPage } = require('./Routes/Role/Cashier/Manage_Product_Categories');
const { getAddProductCategoriePage, postAddProductCategorie } = require('./Routes/Role/Cashier/Add_Product_Categorie');
const { getViewProductCategoriePage } = require('./Routes/Role/Cashier/View_Product_Categorie');
const { getEditProductCategoriePage, postEditProductCategorie } = require('./Routes/Role/Cashier/Edit_Product_Categorie');
const { getDeleteProductCategoriePage } = require('./Routes/Role/Cashier/Delete_Product_Categorie');
const { getProductCategoriesPrintReportPage } = require('./Routes/Role/Cashier/Print_Product_Categories_Report');
app.get('/Role/Cashier/Page/Manage_Product_Categories', authenticateUser(db), checkRole002, getManageProductCategoriesPage);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie', authenticateUser(db), checkRole002, getAddProductCategoriePage);
app.post('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie', authenticateUser(db), checkRole002, postAddProductCategorie);
app.get('/Role/Cashier/Page/Manage_Product_Categories/View/:cat_id', authenticateUser(db), checkRole002, getViewProductCategoriePage);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Edit/:cat_id', authenticateUser(db), checkRole002, getEditProductCategoriePage);
app.post('/Role/Cashier/Page/Manage_Product_Categories/Edit/:cat_id', authenticateUser(db), checkRole002, postEditProductCategorie);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Delete/:cat_id', authenticateUser(db), checkRole002, getDeleteProductCategoriePage);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Print/Report', authenticateUser(db), checkRole002, getProductCategoriesPrintReportPage);

// Make a Trading Transaction Page
const { getMakeaTradingTransactionPage, postAddProductCart, updateProductQuantity, getDeleteProductCartPage, getDeleteMemberProductCartPage, postAddOrder } = require('./Routes/Role/Cashier/Make_a_Trading_Transaction');
app.get('/Role/Cashier/Page/Make_a_Trading_Transaction', authenticateUser(db), checkRole002, getMakeaTradingTransactionPage);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Add_Product_Cart', authenticateUser(db), checkRole002, postAddProductCart);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Update_Product_Quantity', authenticateUser(db), checkRole002, updateProductQuantity);
app.get('/Role/Cashier/Page/Make_a_Trading_Transaction/Delete/:cart_id', authenticateUser(db), checkRole002, getDeleteProductCartPage);
app.get('/Role/Cashier/Page/Make_a_Trading_Transaction/Delete/All/:member_id', authenticateUser(db), checkRole002, getDeleteMemberProductCartPage);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Add_Order', authenticateUser(db), checkRole002, postAddOrder);

// Make a Payment Transaction Page
const { getMakeaPaymentTransactionPage } = require('./Routes/Role/Cashier/Make_a_Payment_Transaction');
const { getMakeaPaymentTransactionOrder, postMakeaPaymentTransactionOrder } = require('./Routes/Role/Cashier/Make_a_Payment_Transaction');
app.get('/Role/Cashier/Page/Make_a_Payment_Transaction', authenticateUser(db), checkRole002, getMakeaPaymentTransactionPage);
app.get('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/:order_id', authenticateUser(db), checkRole002, getMakeaPaymentTransactionOrder);
app.post('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/:order_id', authenticateUser(db), checkRole002, postMakeaPaymentTransactionOrder);

// Electronic Reciept Page
const { getElectronicRecieptPage } = require('./Routes/Role/Cashier/Electronic_Reciept');
const { getElectronicRecieptOrder } = require('./Routes/Role/Cashier/Electronic_Reciept');
app.get('/Role/Cashier/Page/Electronic_Reciept', authenticateUser(db), checkRole002, getElectronicRecieptPage);
app.get('/Role/Cashier/Page/Electronic_Reciept/Order/:order_id', authenticateUser(db), checkRole002, getElectronicRecieptOrder);

// Attach Proof of Payment
const { getAttachProofofPaymentPage } = require('./Routes/Role/Cashier/Attach_Proof_of_Payment');
const { getAttachPaymentOrderPage, postAttachPaymentOrder } = require('./Routes/Role/Cashier/Attach_Payment_Order');
app.get('/Role/Cashier/Page/Attach_Proof_of_Payment', authenticateUser(db), checkRole002, getAttachProofofPaymentPage);
app.get('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/:order_id', authenticateUser(db), checkRole002, getAttachPaymentOrderPage);
app.post('/Role/Cashier/Page/Attach_Proof_of_Payment/Attach/:order_id', authenticateUser(db), checkRole002, postAttachPaymentOrder);

// ==================================================
// Role Customer
// ==================================================
// Profile Page
const { getCustomerProfilePage, postCustomerChangeProfile, postCustomerChangeEmail, postCustomerChangeUsername, postCustomerChangePassword } = require('./Routes/Role/Customer/Profile');
app.get('/Role/Customer/Page/Profile', authenticateUser(db), checkRole003, getCustomerProfilePage);
app.post('/Role/Customer/Page/Profile/ChangeProfile', authenticateUser(db), checkRole001, postCustomerChangeProfile);
app.post('/Role/Customer/Page/Profile/ChangeEmail', authenticateUser(db), checkRole001, postCustomerChangeEmail);
app.post('/Role/Customer/Page/Profile/ChangeUsername', authenticateUser(db), checkRole001, postCustomerChangeUsername);
app.post('/Role/Customer/Page/Profile/ChangePassword', authenticateUser(db), checkRole001, postCustomerChangePassword);

// Order And Receipt Page
const { getOrderAndRecieptPage } = require('./Routes/Role/Customer/Order_And_Receipt');
const { getOrderAndReciept } = require('./Routes/Role/Customer/View_Order_Receipt');
app.get('/Role/Customer/Page/Order_And_Receipt', authenticateUser(db), checkRole003, getOrderAndRecieptPage);
app.get('/Role/Customer/Page/Order_And_Receipt/Order/:order_id', authenticateUser(db), checkRole003, getOrderAndReciept);

// ==================================================
// Error Page
// ==================================================
// 403 Forbidden - ไม่มีสิทธิเข้าถึงระบบส่วนนี้
// app.use((req, res) => {
//     const settings = res.locals.settings;
//     res.status(404).render('Error_Page/403', { title: 'Forbidden Access Denied - ' + settings.text_footer });
// });
// 404 Not Found - ไม่พบหน้าที่ร้องขอ
app.use((req, res) => {
    const settings = res.locals.settings;
    res.status(404).render('Error_Page/404', { title: 'NOT FOUND - ' + settings.text_footer });
});
// 500 Internal Server Error - มีข้อผิดพลาดบางอย่างภายใน server โดยไม่ทราบสาเหตุ
// app.use((req, res) => {
//     const settings = res.locals.settings;
//     res.status(500).render('Error_Page/500', { title: 'INTERNAL SERVER ERROR - ' + settings.text_footer });
// });
// 502 Bad Gateway - server เป็น Gateway หรือ Proxy ได้รับ response ผิดพลาดจาก server อื่น
app.use((req, res) => {
    const settings = res.locals.settings;
    res.status(502).render('Error_Page/502', { title: 'BAD GATEWAY - ' + settings.text_footer });
});
// 503 Service Unavailable - ใช้งานเกินพิกัด(ล่ม) หรือกำลังปรับปรุง server
app.use((req, res) => {
    const settings = res.locals.settings;
    res.status(503).render('Error_Page/503', { title: 'SERVICE UNAAILABLE - ' + settings.text_footer });
});
// 504 Gateway Timeout - server ไม่ได้รับตอบสนองจาก server อื่น จนหมดเวลากันก่อน
app.use((req, res) => {
    const settings = res.locals.settings;
    res.status(504).render('Error_Page/504', { title: 'GATEWAY TIMEOUT - ' + settings.text_footer });
});

// Start the Server - เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    console.log(`Local Server Link: http://localhost:${port}`);
});