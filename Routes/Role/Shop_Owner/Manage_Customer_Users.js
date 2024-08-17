exports.getManageCustomerPage = (req, res) => {
    const title = 'Manage Customer Users | Point Of Sale Management System';
    const your_page = 'Manage_Customer_Users';
    const error = req.flash('error');
    const success = req.flash('success');
    const allowed_roles = ["ROLE003"];
    const roles_placeholder = allowed_roles.map(role => `'${role}'`).join(", ");
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Users
        INNER JOIN User_Role ON Users.role_id = User_Role.role_id
        WHERE User_Role.role_id IN (${roles_placeholder})
        AND (Users.member_firstname LIKE ? OR Users.member_lastname LIKE ?)
    `;

    const dataQuery = `
        SELECT 
            Users.member_id, 
            Users.member_firstname, 
            Users.member_lastname, 
            Users.member_username, 
            Users.member_password, 
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
            User_Role.role_id IN (${roles_placeholder})
            AND (Users.member_firstname LIKE ? OR Users.member_lastname LIKE ?)
        ORDER BY 
            Users.time_order DESC
        LIMIT ${limit} OFFSET ${offset}
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            res.redirect('/');
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery], (err, result) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.render('Role/Shop_Owner/Manage_Customer_Users', {
                        title, 
                        your_page,
                        error: error[0],
                        success: success[0],
                        cus_users: result,
                        totalRecords,
                        currentPage: page,
                        totalPages,
                        search
                    });
                }
            });
        }
    });
};