const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const QRCode = require('qrcode');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./Config/db');
const { authenticateUser, checkRole001, checkRole002, checkRole003 } = require('./Middlewares/auth');
const app = express();
const port = 5000;
const db = connectDB();
global.db = db; 

// Configure session middleware
app.use(session({
    secret: 'ADMIN-DEV-POSMS',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        name: 'SESSION_TOKEN',
        secure: false
    } 
}));

app.use(flash('ADMIN-DEV-POSMS'));
app.use(cookieParser('ADMIN-DEV-POSMS'));
app.set('port', process.env.port || port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/assets', express.static(path.join(__dirname, 'Public/assets')));
app.get('/qrcode-gen', (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).send('Text query parameter is required');
    
    QRCode.toBuffer(text, (err, buffer) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generating QR code');
        }
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
    });
});

// Route Imports
// Home Page
const { getHomePage } = require('./Routes/Index');
// Login Page
const { getLoginPage, postLogin } = require('./Routes/Login');
// Logout Page
const { getLogoutPage } = require('./Routes/Logout');
// Register Page
const { getRegisterPage, postRegister } = require('./Routes/Register');

// ==================================================
// Role Shop_Owner
// ==================================================
// Profile Page
const { getShopOwnerProfilePage, postShopOwnerChangeProfile } = require('./Routes/Role/Shop_Owner/Profile');
const { postShopOwnerChangePassword } = require('./Routes/Role/Shop_Owner/Profile');
// Dashbord Page
const { getShopOwnerDashbordPage } = require('./Routes/Role/Shop_Owner/Dashbord');
// Manage Employee Page
const { getManageEmployeePage } = require('./Routes/Role/Shop_Owner/Manage_Employee_Users');
const { getAddEmployeePage, postAddEmployee } = require('./Routes/Role/Shop_Owner/Add_Employee');
const { getViewEmployeePage } = require('./Routes/Role/Shop_Owner/View_Employee');
const { getEditEmployeePage, postEditEmployee } = require('./Routes/Role/Shop_Owner/Edit_Employee');
const { getDeleteEmployeePage } = require('./Routes/Role/Shop_Owner/Delete_Employee');
// Manage Customer Page
const { getManageCustomerPage } = require('./Routes/Role/Shop_Owner/Manage_Customer_Users');
const { getAddCustomerPage, postAddCustomer } = require('./Routes/Role/Shop_Owner/Add_Customer');
const { getViewCustomerPage } = require('./Routes/Role/Shop_Owner/View_Customer');
const { getEditCustomerPage, postEditCustomer } = require('./Routes/Role/Shop_Owner/Edit_Customer');
const { getDeleteCustomerPage } = require('./Routes/Role/Shop_Owner/Delete_Customer');
// Manage Payment Methods Page
const { getManagePaymentMethodsPage } = require('./Routes/Role/Shop_Owner/Manage_Payment_Methods');
const { getAddPaymentMethodPage, postAddPaymentMethod } = require('./Routes/Role/Shop_Owner/Add_Payment_Method');
const { getViewPaymentMethodPage } = require('./Routes/Role/Shop_Owner/View_Payment_Method');
const { getEditPaymentMethodPage, postEditPaymentMethod } = require('./Routes/Role/Shop_Owner/Edit_Payment_Method');
const { getDeletePaymentMethodPage } = require('./Routes/Role/Shop_Owner/Delete_Payment_Method');
// Sale Reports Page
const { getSaleReportsPage } = require('./Routes/Role/Shop_Owner/Sale_Reports');
const { getViewOrderRecieptPage } = require('./Routes/Role/Shop_Owner/View_Order_Receipt');

// ==================================================
// Role Cashier
// ==================================================
// Profile Page
const { getCashierProfilePage, postCashierChangeProfile } = require('./Routes/Role/Cashier/Profile');
const { postCashierChangePassword } = require('./Routes/Role/Cashier/Profile');
// Manage Products Page
const { getManageProductsPage } = require('./Routes/Role/Cashier/Manage_Products');
const { getAddProductPage, postAddProduct } = require('./Routes/Role/Cashier/Add_Product');
const { getViewProductPage } = require('./Routes/Role/Cashier/View_Product');
const { getEditProductPage, postEditProduct } = require('./Routes/Role/Cashier/Edit_Product');
const { getDeleteProductPage } = require('./Routes/Role/Cashier/Delete_Product');
const { getProductPrintLabelPage } = require('./Routes/Role/Cashier/Print_Product_Label');
const { getProductPrintLabelCustomPage } = require('./Routes/Role/Cashier/Print_Product_Label_Custom');
const { getProductPrintReportPage } = require('./Routes/Role/Cashier/Print_Product_Report');
// Manage Product Categories Page
const { getManageProductCategoriesPage } = require('./Routes/Role/Cashier/Manage_Product_Categories');
const { getAddProductCategoriePage, postAddProductCategorie } = require('./Routes/Role/Cashier/Add_Product_Categorie');
const { getViewProductCategoriePage } = require('./Routes/Role/Cashier/View_Product_Categorie');
const { getEditProductCategoriePage, postEditProductCategorie } = require('./Routes/Role/Cashier/Edit_Product_Categorie');
const { getDeleteProductCategoriePage } = require('./Routes/Role/Cashier/Delete_Product_Categorie');
// Make a Trading Transaction Page
const { getMakeaTradingTransactionPage, postAddProductCart, updateProductQuantity, getDeleteProductCartPage, postAddOrder } = require('./Routes/Role/Cashier/Make_a_Trading_Transaction');
// Make a Payment Transaction Page
const { getMakeaPaymentTransactionPage } = require('./Routes/Role/Cashier/Make_a_Payment_Transaction');
const { getMakeaPaymentTransactionOrder, postMakeaPaymentTransactionOrder } = require('./Routes/Role/Cashier/Make_a_Payment_Transaction');
// Electronic Reciept Page
const { getElectronicRecieptPage } = require('./Routes/Role/Cashier/Electronic_Reciept');
const { getElectronicRecieptOrder } = require('./Routes/Role/Cashier/Electronic_Reciept');

// ==================================================
// Role Customer
// ==================================================
// Profile Page
const { getCustomerProfilePage, postCustomerChangeProfile } = require('./Routes/Role/Customer/Profile');
const { postCustomerChangePassword } = require('./Routes/Role/Customer/Profile');
// Order And Receipt Page
const { getOrderAndRecieptPage } = require('./Routes/Role/Customer/Order_And_Receipt');
const { getOrderAndReciept } = require('./Routes/Role/Customer/View_Order_Receipt');

// Route Definitions
// Home Page
app.get('/', getHomePage);
// Login Page
app.get('/Login', getLoginPage);
app.post('/Login', postLogin);
// Logout Page
app.get('/Logout', getLogoutPage);
// Register Page
app.get('/Register', getRegisterPage);
app.post('/Register', postRegister);

// ==================================================
// Role Shop_Owner
// ==================================================
// Profile Page
app.get('/Role/Shop_Owner/Page/Profile', authenticateUser(db), checkRole001, getShopOwnerProfilePage);
app.post('/Role/Shop_Owner/Page/Profile/Update', authenticateUser(db), checkRole001, postShopOwnerChangeProfile);
app.post('/Role/Shop_Owner/Page/Profile/ChangePassword', authenticateUser(db), checkRole001, postShopOwnerChangePassword);
// Dashbord Page
app.get('/Role/Shop_Owner/Page/Dashbord', authenticateUser(db), checkRole001, getShopOwnerDashbordPage);
// Manage Employee Page
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users', authenticateUser(db), checkRole001, getManageEmployeePage);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Add_Employee', authenticateUser(db), checkRole001, getAddEmployeePage);
app.post('/Role/Shop_Owner/Page/Manage_Employee_Users/Add_Employee', authenticateUser(db), checkRole001, postAddEmployee);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/View/:member_id', authenticateUser(db), checkRole001, getViewEmployeePage);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/:member_id', authenticateUser(db), checkRole001, getEditEmployeePage);
app.post('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/:member_id', authenticateUser(db), checkRole001, postEditEmployee);
app.get('/Role/Shop_Owner/Page/Manage_Employee_Users/Delete/:member_id', authenticateUser(db), checkRole001, getDeleteEmployeePage);
// Manage Customer Page
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users', authenticateUser(db), checkRole001, getManageCustomerPage);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Add_Customer', authenticateUser(db), checkRole001, getAddCustomerPage);
app.post('/Role/Shop_Owner/Page/Manage_Customer_Users/Add_Customer', authenticateUser(db), checkRole001, postAddCustomer);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/View/:member_id', authenticateUser(db), checkRole001, getViewCustomerPage);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Edit/:member_id', authenticateUser(db), checkRole001, getEditCustomerPage);
app.post('/Role/Shop_Owner/Page/Manage_Customer_Users/Edit/:member_id', authenticateUser(db), checkRole001, postEditCustomer);
app.get('/Role/Shop_Owner/Page/Manage_Customer_Users/Delete/:member_id', authenticateUser(db), checkRole001, getDeleteCustomerPage);
// Manage Payment Methods Page
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods', authenticateUser(db), checkRole001, getManagePaymentMethodsPage);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method', authenticateUser(db), checkRole001, getAddPaymentMethodPage);
app.post('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method', authenticateUser(db), checkRole001, postAddPaymentMethod);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/View/:pay_id', authenticateUser(db), checkRole001, getViewPaymentMethodPage);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/:pay_id', authenticateUser(db), checkRole001, getEditPaymentMethodPage);
app.post('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/:pay_id', authenticateUser(db), checkRole001, postEditPaymentMethod);
app.get('/Role/Shop_Owner/Page/Manage_Payment_Methods/Delete/:pay_id', authenticateUser(db), checkRole001, getDeletePaymentMethodPage);
// Sale Reports Page
app.get('/Role/Shop_Owner/Page/Sale_Reports', authenticateUser(db), checkRole001, getSaleReportsPage);
app.get('/Role/Shop_Owner/Page/Sale_Reports/Order/:order_id', authenticateUser(db), checkRole001, getViewOrderRecieptPage);

// ==================================================
// Role Cashier
// ==================================================
// Profile Page
app.get('/Role/Cashier/Page/Profile', authenticateUser(db), checkRole002, getCashierProfilePage);
app.post('/Role/Cashier/Page/Profile/Update', authenticateUser(db), checkRole002, postCashierChangeProfile);
app.post('/Role/Cashier/Page/Profile/ChangePassword', authenticateUser(db), checkRole002, postCashierChangePassword);
// Manage Products Page
app.get('/Role/Cashier/Page/Manage_Products', authenticateUser(db), checkRole002, getManageProductsPage);
app.get('/Role/Cashier/Page/Manage_Products/Add_Product', authenticateUser(db), checkRole002, getAddProductPage);
app.post('/Role/Cashier/Page/Manage_Products/Add_Product', authenticateUser(db), checkRole002, postAddProduct);
app.get('/Role/Cashier/Page/Manage_Products/View/:product_id', authenticateUser(db), checkRole002, getViewProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Edit/:product_id', authenticateUser(db), checkRole002, getEditProductPage);
app.post('/Role/Cashier/Page/Manage_Products/Edit/:product_id', authenticateUser(db), checkRole002, postEditProduct);
app.get('/Role/Cashier/Page/Manage_Products/Delete/:product_id', authenticateUser(db), checkRole002, getDeleteProductPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Label', authenticateUser(db), checkRole002, getProductPrintLabelPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Label/Custom/:product_id', authenticateUser(db), checkRole002, getProductPrintLabelCustomPage);
app.get('/Role/Cashier/Page/Manage_Products/Print/Report', authenticateUser(db), checkRole002, getProductPrintReportPage);
// Manage Product Categories Page
app.get('/Role/Cashier/Page/Manage_Product_Categories', authenticateUser(db), checkRole002, getManageProductCategoriesPage);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie', authenticateUser(db), checkRole002, getAddProductCategoriePage);
app.post('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie', authenticateUser(db), checkRole002, postAddProductCategorie);
app.get('/Role/Cashier/Page/Manage_Product_Categories/View/:cat_id', authenticateUser(db), checkRole002, getViewProductCategoriePage);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Edit/:cat_id', authenticateUser(db), checkRole002, getEditProductCategoriePage);
app.post('/Role/Cashier/Page/Manage_Product_Categories/Edit/:cat_id', authenticateUser(db), checkRole002, postEditProductCategorie);
app.get('/Role/Cashier/Page/Manage_Product_Categories/Delete/:cat_id', authenticateUser(db), checkRole002, getDeleteProductCategoriePage);
// Make a Trading Transaction Page
app.get('/Role/Cashier/Page/Make_a_Trading_Transaction', authenticateUser(db), checkRole002, getMakeaTradingTransactionPage);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Add_Product_Cart', authenticateUser(db), checkRole002, postAddProductCart);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Update_Product_Quantity', authenticateUser(db), checkRole002, updateProductQuantity);
app.get('/Role/Cashier/Page/Make_a_Trading_Transaction/Delete/:cart_id', authenticateUser(db), checkRole002, getDeleteProductCartPage);
app.post('/Role/Cashier/Page/Make_a_Trading_Transaction/Add_Order', authenticateUser(db), checkRole002, postAddOrder);
// Make a Payment Transaction Page
app.get('/Role/Cashier/Page/Make_a_Payment_Transaction', authenticateUser(db), checkRole002, getMakeaPaymentTransactionPage);
app.get('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/:order_id', authenticateUser(db), checkRole002, getMakeaPaymentTransactionOrder);
app.post('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/:order_id', authenticateUser(db), checkRole002, postMakeaPaymentTransactionOrder);
// Electronic Reciept Page
app.get('/Role/Cashier/Page/Electronic_Reciept', authenticateUser(db), checkRole002, getElectronicRecieptPage);
app.get('/Role/Cashier/Page/Electronic_Reciept/Order/:order_id', authenticateUser(db), checkRole002, getElectronicRecieptOrder);

// ==================================================
// Role Customer
// ==================================================
// Profile Page
app.get('/Role/Customer/Page/Profile', authenticateUser(db), checkRole003, getCustomerProfilePage);
app.post('/Role/Customer/Page/Profile/Update', authenticateUser(db), checkRole003, postCustomerChangeProfile);
app.post('/Role/Customer/Page/Profile/ChangePassword', authenticateUser(db), checkRole003, postCustomerChangePassword);
// Order And Receipt Page
app.get('/Role/Customer/Page/Order_And_Receipt', authenticateUser(db), checkRole003, getOrderAndRecieptPage);
app.get('/Role/Customer/Page/Order_And_Receipt/Order/:order_id', authenticateUser(db), checkRole003, getOrderAndReciept);

// ==================================================
// Error Page
// ==================================================
// 403 Forbidden - ไม่มีสิทธิเข้าถึงระบบส่วนนี้
// app.use((req, res) => {
//     res.status(404).render('Error_Page/403', { title: 'Forbidden Access Denied | Point Of Sale Management System' });
// });
// 404 Not Found - ไม่พบหน้าที่ร้องขอ
app.use((req, res) => {
    res.status(404).render('Error_Page/404', { title: 'Not Found | Point Of Sale Management System' });
});
// 500 Internal Server Error - มีข้อผิดพลาดบางอย่างภายใน server โดยไม่ทราบสาเหตุ
// app.use((req, res) => {
//     res.status(500).render('Error_Page/500', { title: 'Internal Server Error | Point Of Sale Management System' });
// });
// 502 Bad Gateway - server เป็น Gateway หรือ Proxy ได้รับ response ผิดพลาดจาก server อื่น
app.use((req, res) => {
    res.status(502).render('Error_Page/502', { title: 'Bad Gateway | Point Of Sale Management System' });
});
// 503 Service Unavailable - ใช้งานเกินพิกัด(ล่ม) หรือกำลังปรับปรุง server
app.use((req, res) => {
    res.status(503).render('Error_Page/503', { title: 'Service Unavailable | Point Of Sale Management System' });
});
// 504 Gateway Timeout - server ไม่ได้รับตอบสนองจาก server อื่น จนหมดเวลากันก่อน
app.use((req, res) => {
    res.status(504).render('Error_Page/504', { title: 'Gateway Timeout | Point Of Sale Management System' });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on port: ${port}\nHost Server Link: http://localhost:${port}`);
});