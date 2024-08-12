exports.getAddPaymentMethodPage = (req, res) => {
    const title = 'Add Payment Method | Point Of Sale Management System';
    const your_page = 'Manage_Payment_Methods';
    res.render('Role/Shop_Owner/Add_Payment_Method', { title, your_page });
};

exports.postAddPaymentMethod = (req, res) => {
    // Get variable
    const { pay_cat_name, pay_bank_name, pay_bank_account_name, pay_bank_number, pay_status } = req.body;
    
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
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods/Add_Payment_Method');
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};