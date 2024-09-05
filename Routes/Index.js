const nodemailer = require('nodemailer');

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
        const title = 'Point Of Sale Management System';
        const error = req.flash('error');
        const formData = req.flash('formData')[0] || {};
        const success = req.flash('success');
        return res.render('Index', { 
            title, 
            error: error[0], 
            formData, 
            success: success[0] 
        });
    }
};

// ฟังก์ชันหลังจาก login
exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const settings = res.locals.settings;

    // ตั้งเวลาเข้าสู่ระบบ
    const now = new Date();
    const formattedDate = now.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const member_time_login = formattedDate + ' ' + formattedTime;

    if (!username || !password) {
        req.flash('error', 'กรุณากรอกข้อมูลให้ครบ');
        req.flash('formData', { username, password });
        return res.redirect('/');
    }

    db.query('SELECT * FROM Users WHERE member_username = ? AND member_password = ?', [username, password], (err, results) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดกับฐานข้อมูล');
            req.flash('formData', { username, password });
            return res.redirect('/');
        }

        if (results.length === 0) {
            req.flash('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            req.flash('formData', { username, password });
            return res.redirect('/');
        }

        const user = results[0];

        // อัปเดตเวลาเข้าสู่ระบบ
        db.query('UPDATE Users SET member_time_login = ? WHERE member_id = ?', [member_time_login, user.member_id], (updateErr) => {
            if (updateErr) {
                req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตเวลา');
                req.flash('formData', { username, password });
                return res.redirect('/');
            }

            let max_age_cookie = {
                '3h': 3 * 60 * 60 * 1000,
                '6h': 6 * 60 * 60 * 1000,
                '9h': 9 * 60 * 60 * 1000,
                '12h': 12 * 60 * 60 * 1000,
                '24h': 24 * 60 * 60 * 1000,
                '7d': 7 * 24 * 60 * 60 * 1000,
                '30d': 30 * 24 * 60 * 60 * 1000,
                '3m': 3 * 30 * 24 * 60 * 60 * 1000,
                '6m': 6 * 30 * 24 * 60 * 60 * 1000,
                '9m': 9 * 30 * 24 * 60 * 60 * 1000,
                '1y': 12 * 30 * 24 * 60 * 60 * 1000
            }[settings.login_time_out] || 7 * 24 * 60 * 60 * 1000;

            res.cookie('MEMBER_TOKEN', user.member_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });
            res.cookie('ROLE_TOKEN', user.role_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });

            // ส่งอีเมล
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: 'posms.newzydev@gmail.com', pass: 'qdai jiww yzhh gtfl' }
            });

            const mailOptions = {
                from: 'POSMS TEAM <posms.newzydev@gmail.com>',
                to: user.member_email,
                subject: 'เรียน คุณ ' + user.member_firstname + ' ' + user.member_lastname + ' เข้าสู่ระบบ เวลา ' + member_time_login,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                        <h1 style="color: #2c3e50; text-align: center;">
                            ยินดีต้อนรับ คุณ ${user.member_firstname} ${user.member_lastname}
                        </h1>
                        <div style="font-size: 16px; color: #34495e; text-align: center;">
                            ลงชื่อเข้าใช้ระบบเพื่อเริ่มเซสชั่นของคุณ
                        </div>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                            <div style="font-size: 16px; color: #333;"><strong>รหัสสมาชิก :</strong> ${user.member_id}</div>
                            <div style="font-size: 16px; color: #333;"><strong>ชื่อ - นามสกุล :</strong> ${user.member_firstname} ${user.member_lastname}</div>
                            <div style="font-size: 16px; color: #333;"><strong>สมัครสมาชิก :</strong> ${user.member_time_register}</div>
                            <div style="font-size: 16px; color: #333;"><strong>เข้าสู่ระบบ :</strong> ${member_time_login}</div>
                        </div>
                        <p style="font-size: 14px; color: #7f8c8d; text-align: center;">
                            (อีเมล์ฉบับนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมล์ฉบับนี้)
                        </p>
                    </div>
                `,
                priority: 'high'
            };            

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            switch (user.role_id) {
                case 'ROLE001': return res.redirect('/Role/Shop_Owner/Page/Dashbord');
                case 'ROLE002': return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                case 'ROLE003': return res.redirect('/Role/Customer/Page/Order_And_Receipt');
                default:
                    res.clearCookie('MEMBER_TOKEN');
                    res.clearCookie('ROLE_TOKEN');
                    return res.redirect('/');
            }
        });
    });
};
