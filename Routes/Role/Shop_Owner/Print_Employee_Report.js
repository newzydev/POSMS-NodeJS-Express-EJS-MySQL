exports.getPrintEmployeeReportPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'PRINT EMPLOYEE REPORT - ' + settings.text_footer;
    const your_page = 'Manage_Employee_Users';
    const error = req.flash('error');
    const success = req.flash('success');
    const allowed_roles = ["ROLE001", "ROLE002"];
    const roles_placeholder = allowed_roles.map(role => `'${role}'`).join(", ");

    const dataQuery = `
        SELECT 
            Users.member_id,
            Users.member_firstname, 
            Users.member_lastname,
            Users.member_email,
            Users.member_tel, 
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
        ORDER BY 
            User_Role.role_name ASC, Users.time_order DESC
    `;

    db.query(dataQuery, (err, result) => {
        if (err) {
            res.redirect('Role/Shop_Owner/Manage_Employee_Users');
        } else {
            res.render('Role/Shop_Owner/Print_Employee_Report', {
                title, 
                your_page,
                error: error[0], 
                success: success[0],
                employee_reports: result
            });
        }
    });
};