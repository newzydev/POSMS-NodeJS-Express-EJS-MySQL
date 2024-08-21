// ฟังก์ชันแสดงหน้า Login
exports.getLoginPage = (req, res) => {
    if (req.signedCookies.MEMBER_TOKEN && req.signedCookies.ROLE_TOKEN) {
        switch (req.signedCookies.ROLE_TOKEN) {
            case 'ROLE001':
                req.flash('success', 'เข้าสู่ระบบ "เจ้าของร้าน" สำเร็จ');
                return res.redirect('/Role/Shop_Owner/Page/Dashbord');
            case 'ROLE002':
                req.flash('success', 'เข้าสู่ระบบ "แคชเชียร์" สำเร็จ');
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            case 'ROLE003':
                req.flash('success', 'เข้าสู่ระบบ "ลูกค้า" สำเร็จ');
                return res.redirect('/Role/Customer/Page/Order_And_Receipt');
            default:
                res.clearCookie('MEMBER_TOKEN');
                res.clearCookie('ROLE_TOKEN');
                return res.redirect('/Login');
        }
    } else {
        const title = 'Login | Point Of Sale Management System';
        const error = req.flash('error');
        const formData = req.flash('formData')[0] || {};
        const success = req.flash('success');
        return res.render('Login', { title, error: error[0], formData, success: success[0] });
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
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { username, password });
        return res.redirect('/Login');
    }

    db.query('SELECT * FROM Users WHERE member_username = ? AND member_password = ?', [username, password], (err, results) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            req.flash('formData', { username, password });
            return res.redirect('/Login');
        }

        if (results.length === 0) {
            req.flash('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            req.flash('formData', { username, password });
            return res.redirect('/Login');
        }

        const user = results[0];

        // Update member_time_login
        db.query('UPDATE Users SET member_time_login = ? WHERE member_id = ?', [member_time_login, user.member_id], (updateErr) => {
            if (updateErr) {
                req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตเวลาเข้าสู่ระบบ');
                req.flash('formData', { username, password });
                return res.redirect('/Login');
            }

            const max_age_cookie = 30 * 24 * 60 * 60 * 1000; // 30 วัน
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
                    req.flash('success', 'เข้าสู่ระบบ "เจ้าของร้าน" สำเร็จ');
                    return res.redirect('/Role/Shop_Owner/Page/Dashbord');
                case 'ROLE002':
                    req.flash('success', 'เข้าสู่ระบบ "แคชเชียร์" สำเร็จ');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                case 'ROLE003':
                    req.flash('success', 'เข้าสู่ระบบ "ลูกค้า" สำเร็จ');
                    return res.redirect('/Role/Customer/Page/Order_And_Receipt');
                default:
                    res.clearCookie('MEMBER_TOKEN');
                    res.clearCookie('ROLE_TOKEN');
                    return res.redirect('/Login');
            }
        });
    });
};
