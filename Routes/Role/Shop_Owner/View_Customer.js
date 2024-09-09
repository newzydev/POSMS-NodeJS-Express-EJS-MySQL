exports.getViewCustomerPage = (req, res) => {
    const title = 'View Customer | Point Of Sale Management System';
    const your_page = 'Manage_Customer_Users';
    const member_id = req.params.member_id;
    
    const dataQuery = `
        SELECT 
            Users.member_id,
            Users.member_firstname, 
            Users.member_lastname,
            Users.member_email,
            Users.member_email_activate,
            Users.member_tel, 
            Users.member_time_register, 
            Users.member_time_login, 
            User_Role.role_id, 
            User_Role.role_name 
        FROM 
            Users 
        INNER JOIN 
            User_Role 
        ON 
            Users.role_id = User_Role.role_id 
        WHERE
            member_id = ?
    `;
    
    db.query(dataQuery, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        } else {
            res.render('Role/Shop_Owner/View_Customer', { 
                title, 
                your_page,
                customer: result[0] 
            });
        }
    });
};