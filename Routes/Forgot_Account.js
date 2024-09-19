const nodemailer = require('nodemailer');

exports.getForgotAccountPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'FORGOT ACCOUNT - ' + settings.text_footer;
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Forgot_Account', { title, error: error[0], formData, success: success[0] });
};

exports.postForgotAccount = (req, res) => {
    const settings = res.locals.settings;
    const { member_email, member_tel } = req.body;
    const code_6_digit = Math.floor(100000 + Math.random() * 900000).toString();

    if (!member_email || !member_tel) {
        req.flash('error', 'กรุณากรอกข้อมูลให้ครบ');
        req.flash('formData', { member_email, member_tel });
        return res.redirect('/');
    }

    db.query('SELECT * FROM Users WHERE member_email = ? AND member_tel = ?', [member_email, member_tel], (err, results) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดกับฐานข้อมูล');
            req.flash('formData', { member_email, member_tel });
            return res.redirect('/');
        }

        if (results.length === 0) {
            req.flash('error', 'ที่อยู่อีเมล์ หรือ โทรศัพท์ไม่ถูกต้อง');
            req.flash('formData', { member_email, member_tel });
            return res.redirect('/');
        }

        const user = results[0];

        const max_age_cookie = 5 * 60 * 1000; // 5 นาที

        res.cookie('FORGOT_AC_TOKEN', code_6_digit, { maxAge: max_age_cookie, httpOnly: true, path: '/', signed: true });

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
                subject: '[POSMS] แจ้งเตือนการกู้คืนบัญชีผู้ใช้ #'+ Mail_Id,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                        <h1 style="color: #ffffff; text-align: center;">
                            ยินดีต้อนรับ คุณ ${user.member_firstname} ${user.member_lastname}
                        </h1>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                            <div style="font-size: 16px; color: #333333;"><strong>รหัสสมาชิก</strong> ${user.member_id}</div>
                            <div style="font-size: 16px; color: #333333;"><strong>ชื่อเต็ม</strong> ${user.member_firstname} ${user.member_lastname}</div>
                            <div style="font-size: 16px; color: #333333;"><strong>รหัส OTP ยืนยัน 6 หลัก</strong> ${code_6_digit}</div>
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

        res.redirect('/Forgot_Account/Forgot_Account_Verify/' + user.member_id);

    });
};