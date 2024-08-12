exports.getShopOwnerProfilePage = (req, res) => {
    const title = 'Profile | Point Of Sale Management System';
    const your_page = 'Profile';
    res.render('Role/Shop_Owner/Profile', { title, your_page });
};

exports.postShopOwnerChangeProfile = (req, res) => {
    const title = 'Profile | Point Of Sale Management System';
    const your_page = 'Profile';

    const { member_id, firstname, lastname, username, phone_number } = req.body;

    if (!firstname || !lastname || !username || !phone_number) {
        return res.status(400).render('Role/Shop_Owner/Profile', { 
            title,
            your_page,
            error: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        });
    }

    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_username = ?, member_tel = ? WHERE member_id = ?';

    db.query(query, [firstname, lastname, username, phone_number, member_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/Role/Shop_Owner/Page/Profile');
    });
};

exports.postShopOwnerChangePassword = (req, res) => {
    const title = 'Profile | Point Of Sale Management System';
    const your_page = 'Profile';

    const { member_id, old_password, new_password, confirm_new_password } = req.body;

    if (!old_password || !new_password || !confirm_new_password) {
        return res.status(400).render('Role/Cashier/Profile', { 
            title,
            your_page,
            error: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        });
    }

    if (new_password !== confirm_new_password) {
        return res.status(400).render('Role/Shop_Owner/Profile', { 
            title,
            your_page, 
            error: 'รหัสผ่านไม่ตรงกัน' 
        });
    }

    const query = 'SELECT member_password FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        const user = result[0];

        if (old_password !== user.member_password) {
            return res.status(400).render('Role/Shop_Owner/Profile', { 
                title,
                your_page,
                error: 'รหัสผ่านเดิมไม่ถูกต้อง' 
            });
        }

        const updateQuery = 'UPDATE Users SET member_password = ? WHERE member_id = ?';
        db.query(updateQuery, [new_password, member_id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/Role/Shop_Owner/Page/Profile');
        });
    });
};