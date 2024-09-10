exports.getEditPaymentMethodPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'EDIT PAYMENT METHOD - ' + settings.text_footer;
    const your_page = 'Manage_Payment_Methods';
    const error = req.flash('error');
    const success = req.flash('success');
    
    const pay_id = req.params.pay_id;
    const query = 'SELECT * FROM Payment_Options WHERE pay_id = ?';
    
    db.query(query, [pay_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขรูปแบบชำระเงิน');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        } else {
            res.render('Role/Shop_Owner/Edit_Payment_Method', { 
                title,
                your_page,
                error: error[0],
                success: success[0],
                pay_method: result[0] 
            });
        }
    });
};

exports.postEditPaymentMethod = (req, res) => {
    const pay_id = req.params.pay_id;
    const { pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status } = req.body;

    if (!pay_cat_name || !pay_bank_name || !pay_bank_account_name || !pay_bank_number || !pay_status) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
    }
    
    const query = 'UPDATE Payment_Options SET pay_cat_name = ?, pay_bank_name = ?, pay_bank_account_name = ?, pay_bank_number = ?, pay_status = ? WHERE pay_id = ?';
    
    db.query(query, [pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status, pay_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขรูปแบบชำระเงิน');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/' + pay_id);
        } else {
            req.flash('success', 'บันทึกข้อมูลรูปแบบชำระเงินสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};