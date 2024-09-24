const nodemailer = require('nodemailer');

exports.getLoginVerifyPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'LOGIN VERIFY - ' + settings.text_footer;
    const error = req.flash('error');
    const success = req.flash('success');

    const member_id = req.params.member_id;
    const query = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดกับฐานข้อมูล');
            return res.redirect('/Login_Verify');
        }
        
        if (result.length === 0) {
            req.flash('error', 'ไม่พบข้อมูลสมาชิก');
            return res.redirect('/Login_Verify');
        }
        
        res.render('Login_Verify', { 
            title,
            error: error[0],
            success: success[0],
            customer: result[0]
        });
    });
};

exports.postLoginVerify = (req, res) => {
    const settings = res.locals.settings;
    const member_id = req.params.member_id;
    const { code_6_digit_verify } = req.body;

    // ตั้งเวลาเข้าสู่ระบบ
    const now = new Date();
    const formattedDate = now.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const member_time_login = formattedDate + ' ' + formattedTime;

    if (!code_6_digit_verify) {
        req.flash('error', 'กรุณากรอกรหัส OTP ยืนยัน 6 หลักในช่อง');
        return res.redirect('/Login_Verify/' + member_id);
    }

    // ตรวจสอบว่า cookies มีค่า FORGOT_AC_TOKEN หรือไม่
    const tokenInCookie = req.signedCookies.LOGIN_AC_TOKEN;
    if (!tokenInCookie) {
        req.flash('error', 'ไม่พบโทเค็น OTP ในคุกกี้');
        return res.redirect('/Login_Verify/' + member_id);
    }

    const queryUserInfo = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(queryUserInfo, [member_id], (err, userInfo) => {
        if (err || userInfo.length === 0) {
            req.flash('error', 'ไม่พบข้อมูลสมาชิก');
            return res.redirect('/Login_Verify/' + member_id);
        }

        const user = userInfo[0];

        // ตรวจสอบรหัส OTP ว่าตรงกันหรือไม่
        if (code_6_digit_verify !== tokenInCookie) {
            req.flash('error', 'รหัสยืนยันที่อยู่อีเมล์ 6 หลักไม่ถูกต้อง');
            return res.redirect('/Login_Verify/' + member_id);
        }
        
        // อัปเดตเวลาเข้าสู่ระบบ
        db.query('UPDATE Users SET member_time_login = ? WHERE member_id = ?', [member_time_login, user.member_id], (updateErr) => {
            if (updateErr) {
                req.flash('error', 'เกิดข้อผิดพลาดในการอัปเดตเวลา');
                req.flash('formData', { member_username, member_password });
                return res.redirect('/');
            }

            const max_age_cookie = 30 * 24 * 60 * 60 * 1000; // 30 วัน

            res.cookie('MEMBER_TOKEN', user.member_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });
            res.cookie('ROLE_TOKEN', user.role_id, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });

            // ส่งอีเมล
            if (user.member_email) {
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: `${settings.mail_auto_sent}`, pass: `${settings.mail_app_password}` }
                });
            
                const mailOptions = {
                    from: `${settings.mail_name} <${settings.mail_auto_sent}>`,
                    to: user.member_email,
                    subject: 'ลงชื่อเข้าใช้งานระบบ (' + member_time_login + ')',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                            <div style="text-align: center;">
                                <img src="https://github.com/newzydev/Point-Of-Sale-Management-System-NodeJS-Express-EJS/blob/main/Public/assets/images/logo/logo_icon_w.png?raw=true" alt="Logo" style="max-width: 50px;">
                            </div>
                            <h2 style="color: #ffffff; text-align: center;">
                                สวัสดีคุณ ${user.member_firstname} ${user.member_lastname}
                            </h2>
                            <div style="background-color: #ffffff; padding: 15px; margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333333;"><strong>ลงชื่อเข้าใช้งานระบบ</strong></div>
                                <hr style="border: 1px solid #e0e0e0;">
                                <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>ณ เวลา</strong> ${member_time_login}</div>
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

            switch (user.role_id) {
                case 'ROLE001': 
                    res.clearCookie('LOGIN_AC_TOKEN');
                    return res.redirect('/Role/Shop_Owner/Page/Dashbord');
                case 'ROLE002': 
                    res.clearCookie('LOGIN_AC_TOKEN');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                case 'ROLE003': 
                    res.clearCookie('LOGIN_AC_TOKEN');
                    return res.redirect('/Role/Customer/Page/Order_And_Receipt');
                default:
                    res.clearCookie('LOGIN_AC_TOKEN');
                    res.clearCookie('MEMBER_TOKEN');
                    res.clearCookie('ROLE_TOKEN');
                    return res.redirect('/');
            }
        });

    });
};