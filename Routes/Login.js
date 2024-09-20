const nodemailer = require('nodemailer');

// ฟังก์ชันแสดงหน้า Login
exports.getLoginPage = (req, res) => {
    const settings = res.locals.settings;
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
        const title = settings.text_footer;
        const error = req.flash('error');
        const formData = req.flash('formData')[0] || {};
        const success = req.flash('success');
        return res.render('Login', { 
            title, 
            error: error[0], 
            formData, 
            success: success[0] 
        });
    }
};

// ฟังก์ชันหลังจาก login
exports.postLogin = (req, res) => {
    const settings = res.locals.settings;
    const { member_username, member_password } = req.body;
    const code_6_digit = Math.floor(100000 + Math.random() * 900000).toString();

    if (!member_username || !member_password) {
        req.flash('error', 'กรุณากรอกข้อมูลให้ครบ');
        req.flash('formData', { member_username, member_password });
        return res.redirect('/');
    }

    db.query('SELECT * FROM Users WHERE member_username = ? AND member_password = ?', [member_username, member_password], (err, results) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดกับฐานข้อมูล');
            req.flash('formData', { member_username, member_password });
            return res.redirect('/');
        }

        if (results.length === 0) {
            req.flash('error', 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง');
            req.flash('formData', { member_username, member_password });
            return res.redirect('/');
        }

        const user = results[0];

        const max_age_cookie = 5 * 60 * 1000; // 5 นาที

        res.cookie('LOGIN_AC_TOKEN', code_6_digit, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });

        // ส่งอีเมล
        if (user.member_email) {
            // Generate a timestamp-based ID: YYYYMMDDHHMMSS
            const now = new Date();
            const Mail_Id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: `${settings.mail_auto_sent}`, pass: `${settings.mail_app_password}` }
            });
        
            const mailOptions = {
                from: `${settings.mail_name} <${settings.mail_auto_sent}>`,
                to: user.member_email,
                subject: '[POSMS] แจ้งเตือนลงชื่อเข้าใช้ รหัส OTP สำหรับยืนยันตัวตน #' + Mail_Id,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                        <h1 style="color: #ffffff; text-align: center;">
                            สวัสดีคุณ คุณ ${user.member_firstname} ${user.member_lastname}
                        </h1>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                            <div style="font-size: 16px; color: #333333;"><strong>รหัสยืนยันตัวตน จะมีอายุ 5 นาที หลัจากนั้นจะต้องลงชื่อเข้าใช้ระบบใหม่</strong></div>
                            <hr style="border: 1px solid #e0e0e0;">
                            <div style="font-size: 16px; color: #333333;"><strong>รหัส OTP ยืนยัน</strong></div>
                            <h1 style="color: #333333; margin: 0"><strong>${code_6_digit}</strong></h1>
                            <div style="font-size: 16px; color: #333333;"><strong>ใช้สำหรับยืนยันตัวตน</strong></div>
                        </div>
                        <p style="font-size: 14px; color: #ffffff; text-align: center;">
                            * เฉพาะคุณเท่านั้นที่สามารถเห็นอีเมล์ฉบับนี้<br>
                            ** อีเมล์ฉบับนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมล์ฉบับนี้
                        </p>
                    </div>
                    <p style="font-size: 12px; color: #333333; text-align: center;">
                        COPYRIGHT © ${settings.mail_name} All RIGHT RESERVED<br>
                        DEVOLOP BY <a href="https://github.com/newzydev">NEWZYDEV</a> POWERED BY <a href="https://mail.google.com/">GOOGLE MAIL</a>
                    </p>
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
        } else {
            console.log('ไม่พบที่อยู่อีเมล์ของผู้รับ');
        }

        res.redirect('/Login_Verify/' + user.member_id);

    });
};
