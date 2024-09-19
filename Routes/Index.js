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
    const { member_username, member_password } = req.body;
    const settings = res.locals.settings;

    // ตั้งเวลาเข้าสู่ระบบ
    const now = new Date();
    const formattedDate = now.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const member_time_login = formattedDate + ' ' + formattedTime;

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
            req.flash('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            req.flash('formData', { member_username, member_password });
            return res.redirect('/');
        }

        const user = results[0];

        if (user.member_email_activate === "ACTIVATE") {
            
            // อัปเดตเวลาเข้าสู่ระบบ
            db.query('UPDATE Users SET member_time_login = ? WHERE member_id = ?', [member_time_login, user.member_id], (updateErr) => {
                if (updateErr) {
                    req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตเวลา');
                    req.flash('formData', { member_username, member_password });
                    return res.redirect('/');
                }
    
                const max_age_cookie = 30 * 24 * 60 * 60 * 1000;
    
                res.cookie('MEMBER_TOKEN', user.member_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });
                res.cookie('ROLE_TOKEN', user.role_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });
    
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
                        subject: '[POSMS] แจ้งเตือนการลงชื่อเข้าใช้งานระบบ #' + Mail_Id,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                                <h1 style="color: #ffffff; text-align: center;">
                                    สวัสดี คุณ ${user.member_firstname} ${user.member_lastname}
                                </h1>
                                <div style="background-color: #ffffff; padding: 15px; margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                    <div style="font-size: 16px; color: #333333;"><strong>รหัสสมาชิก</strong> ${user.member_id}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>ชื่อเต็ม</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>เข้าสู่ระบบ</strong> ${member_time_login}</div>
                                </div>
                                <p style="font-size: 14px; color: #ffffff; text-align: center;">
                                    * เฉพาะคุณเท่านั้นที่สามารถเห็นอีเมล์ฉบับนี้<br>
                                    ** อีเมล์ฉบับนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมล์ฉบับนี้
                                </p>
                            </div>
                            <p style="font-size: 14px; color: #333333; text-align: center;">
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

        } else {
            req.flash('error', 'กรุณายืนยันที่อยู่อีเมล์ก่อน โดยการกรอกรหัส 6 หลักที่ถูกส่งไปยังที่อยู่อีเมล์ของคุณ');
            res.redirect('/Account_Register_Activate/' + user.member_id);
        }

    });
};
