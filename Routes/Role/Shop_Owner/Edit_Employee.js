exports.getEditEmployeePage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'EDIT EMPLOYEE - ' + settings.text_footer;
    const your_page = 'Manage_Employee_Users';
    const error = req.flash('error');
    const success = req.flash('success');
    
    const member_id = req.params.member_id;
    const query = `
        SELECT
            member_id,
            role_id,
            member_firstname,
            member_lastname
        FROM Users
        WHERE member_id = ?
    `;
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        } else {
            res.render('Role/Shop_Owner/Edit_Employee', { 
                title,
                your_page,
                error: error[0],
                success: success[0],
                employee: result[0] 
            });
        }
    });
};

exports.postEditEmployee = (req, res) => {
    const member_id = req.params.member_id;
    const { first_name, last_name, role_id } = req.body;

    if (!first_name || !last_name || !role_id) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
    }

    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, role_id = ? WHERE member_id = ?';
    
    db.query(query, [first_name, last_name, role_id, member_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขบัญชีพนักงาน');
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users/Edit/' + member_id);
        } else {
            req.flash('success', 'บันทึกข้อมูลบัญชีพนักงานสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Manage_Employee_Users');
        }
    });
};