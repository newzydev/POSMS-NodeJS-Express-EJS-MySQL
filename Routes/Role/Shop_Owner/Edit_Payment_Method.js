exports.getEditPaymentMethodPage = (req, res) => {
    const title = 'Edit Payment Method | Point Of Sale Management System';
    const your_page = 'Manage_Payment_Methods';
    
    const pay_id = req.params.pay_id;
    const query = 'SELECT * FROM Payment_Options WHERE pay_id = ?';
    
    db.query(query, [pay_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        } else {
            res.render('Role/Shop_Owner/Edit_Payment_Method', { 
                title, your_page,
                pay_method: result[0] 
            });
        }
    });
};

exports.postEditPaymentMethod = (req, res) => {
    const pay_id = req.params.pay_id;
    const { pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status } = req.body;
    const query = 'UPDATE Payment_Options SET pay_cat_name = ?, pay_bank_name = ?, pay_bank_account_name = ?, pay_bank_number = ?, pay_status = ? WHERE pay_id = ?';
    
    db.query(query, [pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status, pay_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods/Edit/' + pay_id);
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};