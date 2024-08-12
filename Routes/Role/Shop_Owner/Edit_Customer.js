exports.getEditCustomerPage = (req, res) => {
    const title = 'Edit Customer | Point Of Sale Management System';
    const your_page = 'Manage_Customer_Users';
    
    const member_id = req.params.member_id;
    const query = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        } else {
            res.render('Role/Shop_Owner/Edit_Customer', { 
                title, your_page,
                customer: result[0] 
            });
        }
    });
};

exports.postEditCustomer = (req, res) => {
    const member_id = req.params.member_id;
    const { first_name, last_name, username, password, phone_number } = req.body;
    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_username = ?, member_password = ?, member_tel = ? WHERE member_id = ?';
    
    db.query(query, [first_name, last_name, username, password, phone_number, member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users/Edit/' + member_id);
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        }
    });
};