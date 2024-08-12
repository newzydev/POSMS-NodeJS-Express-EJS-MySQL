// ฟังก์ชันแสดงหน้า Login
exports.getLoginPage = (req, res) => {
    if (req.cookies.member_id && req.cookies.role_id) {
        switch (req.cookies.role_id) {
            case 'ROLE001':
                return res.redirect('/Role/Shop_Owner/Page/Dashbord');
            case 'ROLE002':
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            case 'ROLE003':
                return res.redirect('/Role/Customer/Page/Order_And_Receipt');
            default:
                res.clearCookie('member_id');
                res.clearCookie('role_id');
                return res.redirect('/Login');
        }
    } else {
        const title = 'Login | Point Of Sale Management System';
        return res.render('Login', { title, formData: {} });
    }
};

// ฟังก์ชันสำหรับการดำเนินการหลังจาก login
exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    // Set Date and Time Login
    const now = new Date();
    const options_date = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const options_time = {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('th-TH', options_date);
    const formattedTime = now.toLocaleTimeString('th-TH', options_time);
    const member_time_login = formattedDate + ' ' + formattedTime;

    if (!username || !password) {
        return res.render('Login', { 
            title: 'Login | Point Of Sale Management System', 
            error: 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง',
            formData: { username, password }
        });
    }

    db.query('SELECT * FROM Users WHERE member_username = ? AND member_password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).render('Login', { 
                title: 'Login | Point Of Sale Management System', 
                error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
                formData: { username, password }
            });
        }

        if (results.length === 0) {
            return res.render('Login', { 
                title: 'Login | Point Of Sale Management System', 
                error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                formData: { username, password }
            });
        }

        const user = results[0];

        // Update member_time_login
        db.query('UPDATE Users SET member_time_login = ? WHERE member_id = ?', [member_time_login, user.member_id], (updateErr) => {
            if (updateErr) {
                return res.render('Login', { 
                    title: 'Login | Point Of Sale Management System', 
                    error: 'เกิดข้อผิดพลาดในการอัปเดตเวลาเข้าสู่ระบบ',
                    formData: { username, password }
                });
            }

            res.cookie('member_id', user.member_id, { maxAge: 2592000000, httpOnly: true });
            res.cookie('role_id', user.role_id, { maxAge: 2592000000, httpOnly: true });

            switch (user.role_id) {
                case 'ROLE001':
                    return res.redirect('/Role/Shop_Owner/Page/Dashbord');
                case 'ROLE002':
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                case 'ROLE003':
                    return res.redirect('/Role/Customer/Page/Order_And_Receipt');
                default:
                    res.clearCookie('member_id');
                    res.clearCookie('role_id');
                    return res.redirect('/Login');
            }
        });
    });
};