const nodemailer = require('nodemailer');

exports.getForgotAccountVerifyPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'FORGOT ACCOUNT - ' + settings.text_footer;
    const error = req.flash('error');
    const success = req.flash('success');

    const member_id = req.params.member_id;
    const query = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดกับฐานข้อมูล');
            return res.redirect('/Forgot_Account');
        }
        
        if (result.length === 0) {
            req.flash('error', 'ไม่พบข้อมูลสมาชิก');
            return res.redirect('/Forgot_Account');
        }
        
        res.render('Forgot_Account_Verify', { 
            title,
            error: error[0],
            success: success[0],
            customer: result[0]
        });
    });
};

exports.postForgotAccountVerify = (req, res) => {
    const settings = res.locals.settings;
    const member_id = req.params.member_id;
    const { code_6_digit_verify } = req.body;

    if (!code_6_digit_verify) {
        req.flash('error', 'กรุณากรอกรหัส OTP ยืนยัน 6 หลักในช่อง');
        return res.redirect('/Forgot_Account/Forgot_Account_Verify/' + member_id);
    }

    // ตรวจสอบว่า cookies มีค่า FORGOT_AC_TOKEN หรือไม่
    const tokenInCookie = req.signedCookies.FORGOT_AC_TOKEN;
    if (!tokenInCookie) {
        req.flash('error', 'ไม่พบโทเค็น OTP ในคุกกี้');
        return res.redirect('/Forgot_Account/Forgot_Account_Verify/' + member_id);
    }

    const queryUserInfo = 'SELECT member_firstname, member_lastname, member_email, member_username, member_password FROM Users WHERE member_id = ?';
    
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
    const mail_time_transaction = formattedDate + ' ' + formattedTime;

    db.query(queryUserInfo, [member_id], (err, userInfo) => {
        if (err || userInfo.length === 0) {
            req.flash('error', 'ไม่พบข้อมูลสมาชิก');
            return res.redirect('/Forgot_Account/Forgot_Account_Verify/' + member_id);
        }

        const { member_firstname, member_lastname, member_email, member_username, member_password } = userInfo[0];

        // ตรวจสอบรหัส OTP ว่าตรงกันหรือไม่
        if (code_6_digit_verify !== tokenInCookie) {
            req.flash('error', 'รหัสยืนยันที่อยู่อีเมล์ 6 หลักไม่ถูกต้อง');
            return res.redirect('/Forgot_Account/Forgot_Account_Verify/' + member_id);
        }
        
        // ส่งอีเมลยืนยันการกู้คืนบัญชี
        if (member_email) {
            
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: `${settings.mail_auto_sent}`, pass: `${settings.mail_app_password}` }
            });
        
            const mailOptions = {
                from: `${settings.mail_name} <${settings.mail_auto_sent}>`,
                to: member_email,
                subject: 'กู้คืนบัญชีผู้ใช้สำเร็จ ' + member_firstname + ' ' + member_lastname + ' (' + mail_time_transaction + ')',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                        <div style="text-align: center;">
                            <img src="https://github.com/newzydev/Point-Of-Sale-Management-System-NodeJS-Express-EJS/blob/main/Public/assets/images/logo/logo_icon_w.png?raw=true" alt="Logo" style="max-width: 50px;">
                        </div>
                        <h2 style="color: #ffffff; text-align: center;">
                            สวัสดีคุณ คุณ ${member_firstname} ${member_lastname}
                        </h2>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                            <div style="font-size: 16px; color: #333333;"><strong>คุณได้กู้คืนบัญชีผู้ใช้สำเร็จ</strong> ${member_id}</div>
                            <hr style="border: 1px solid #e0e0e0;">
                            <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${member_firstname} ${member_lastname}</div>
                            <div style="font-size: 16px; color: #333333;"><strong>ชื่อผู้ใช้ของคุณ คือ</strong> ${member_username}</div>
                            <div style="font-size: 16px; color: #333333;"><strong>รหัสผ่านของคุณ คือ</strong> ${member_password}</div>
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

        res.clearCookie('FORGOT_AC_TOKEN');
        req.flash('success', 'กู้คืนบัญชีผู้ใช้สำเร็จ ตรวจสอบข้อมูลบัญชีผู้ใช้ได้จากอีเมล์อัตโนมัติที่ส่งไป');
        res.redirect('/');
    });
};