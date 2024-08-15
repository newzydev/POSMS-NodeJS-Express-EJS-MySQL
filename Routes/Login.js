// ฟังก์ชันแสดงหน้า Login
exports.getLoginPage = (req, res) => {
    if (req.signedCookies.MEMBER_TOKEN && req.signedCookies.ROLE_TOKEN) {
        switch (req.signedCookies.ROLE_TOKEN) {
            case 'ROLE001':
                return res.redirect('/Role/Shop_Owner/Page/Dashbord');
            case 'ROLE002':
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            case 'ROLE003':
                return res.redirect('/Role/Customer/Page/Order_And_Receipt');
            default:
                res.clearCookie('MEMBER_TOKEN');
                res.clearCookie('ROLE_TOKEN');
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

            const max_age_cookie = 7 * 24 * 60 * 60 * 1000; // 7 วัน
            res.cookie('MEMBER_TOKEN', user.member_id, { 
                maxAge: max_age_cookie, 
                httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
                path: '/', // ใช้ได้ทั่วทั้งไซต์
                signed: true // ลงชื่อ cookie
            });
            res.cookie('ROLE_TOKEN', user.role_id, { 
                maxAge: max_age_cookie, 
                httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
                path: '/', // ใช้ได้ทั่วทั้งไซต์
                signed: true // ลงชื่อ cookie
            });

            switch (user.role_id) {
                case 'ROLE001':
                    return res.redirect('/Role/Shop_Owner/Page/Dashbord');
                case 'ROLE002':
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                case 'ROLE003':
                    return res.redirect('/Role/Customer/Page/Order_And_Receipt');
                default:
                    res.clearCookie('MEMBER_TOKEN');
                    res.clearCookie('ROLE_TOKEN');
                    return res.redirect('/Login');
            }
        });
    });
};
