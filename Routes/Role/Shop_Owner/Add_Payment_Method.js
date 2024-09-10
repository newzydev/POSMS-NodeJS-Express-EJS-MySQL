exports.getAddPaymentMethodPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'ADD PAYMENT METHOD - ' + settings.text_footer;
    const your_page = 'Manage_Payment_Methods';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Shop_Owner/Add_Payment_Method', { title, your_page, error: error[0], formData, success: success[0] });
};

exports.postAddPaymentMethod = (req, res) => {
    // Get variable
    const { pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status } = req.body;
    
    if (!pay_cat_name || !pay_bank_name || !pay_bank_account_name || !pay_bank_number || !pay_status) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { pay_bank_name, pay_bank_account_name, pay_bank_number });
        return res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method');
    }
    // Generate Member ID
    const generatePayId = () => {
        return 'PA' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const pay_id = generatePayId();

    // Query SQL
    const query = 'INSERT INTO Payment_Options (pay_id, pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [pay_id, pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method');
        } else {
            req.flash('success', 'บันทึกข้อมูลรูปแบบชำระเงินสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};