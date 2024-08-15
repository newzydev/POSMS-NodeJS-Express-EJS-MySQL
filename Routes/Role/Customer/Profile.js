exports.getCustomerProfilePage = (req, res) => {
    const title = 'Profile | Point Of Sale Management System';
    const your_page = 'Profile';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Customer/Profile', { title, your_page, error: error[0], formData, success: success[0] });
};

exports.postCustomerChangeProfile = (req, res) => {
    const { member_id, firstname, lastname, username, phone_number } = req.body;

    if (!firstname || !lastname || !username || !phone_number) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { firstname, lastname, username, phone_number });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_username = ?, member_tel = ? WHERE member_id = ?';

    db.query(query, [firstname, lastname, username, phone_number, member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขบัญชีผู้ใช้');
            req.flash('formData', { firstname, lastname, username, phone_number });
            res.redirect('/Role/Customer/Page/Profile');
        } else {
            req.flash('success', 'บันทึกข้อมูลบัญชีผู้ใช้สำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        }
    });
};

exports.postCustomerChangePassword = (req, res) => {
    const { member_id, old_password, new_password, confirm_new_password } = req.body;

    if (!old_password || !new_password || !confirm_new_password) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_password, new_password, confirm_new_password });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_password !== confirm_new_password) {
        req.flash('error', 'รหัสผ่าน และการยืนยันรหัสผ่านไม่ตรงกัน');
        req.flash('formData', { new_password, confirm_new_password });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'SELECT member_password FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const user = result[0];

        if (old_password !== user.member_password) {
            req.flash('error', 'รหัสผ่านเดิมไม่ถูกต้อง');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_password = ? WHERE member_id = ?';
        db.query(updateQuery, [new_password, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน');
                req.flash('formData', { old_password, new_password, confirm_new_password });
                return res.redirect('/Role/Customer/Page/Profile');
            }
            
            req.flash('success', 'บันทึกข้อมูลรหัสผ่านสำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        });
    });
};