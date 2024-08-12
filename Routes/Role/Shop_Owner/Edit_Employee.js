exports.getEditEmployeePage = (req, res) => {
    const title = 'Edit Employee | Point Of Sale Management System';
    const your_page = 'Manage_Employee_Users';
    
    const member_id = req.params.member_id;
    const query = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        } else {
            res.render('Role/Shop_Owner/Edit_Employee', { 
                title, your_page,
                employee: result[0] 
            });
        }
    });
};

exports.postEditEmployee = (req, res) => {
    const member_id = req.params.member_id;
    const { first_name, last_name, username, password, phone_number, role_id } = req.body;
    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_username = ?, member_password = ?, member_tel = ?, role_id = ? WHERE member_id = ?';
    
    db.query(query, [first_name, last_name, username, password, phone_number, role_id, member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/' + member_id);
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        }
    });
};