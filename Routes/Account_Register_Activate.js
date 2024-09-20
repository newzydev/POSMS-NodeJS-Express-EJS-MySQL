const nodemailer = require('nodemailer');

exports.getRegisterActivatePage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'E-MAIL ACTIVATE - ' + settings.text_footer;
    const error = req.flash('error');
    const success = req.flash('success');
    
    const member_id = req.params.member_id;
    const query = 'SELECT * FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Account_Register_Activate/' + member_id);
        } else {
            res.render('Account_Register_Activate', { 
                title,
                error: error[0],
                success: success[0],
                customer: result[0] 
            });
        }
    });
};

exports.postRegisterActivate = (req, res) => {
    const settings = res.locals.settings;
    const member_id = req.params.member_id;
    const { code_6_digit } = req.body;

    if (!code_6_digit) {
        req.flash('error', 'กรุณากรอกรหัสยืนยันที่อยู่อีเมล์ 6 หลักในช่อง');
        return res.redirect('/Account_Register_Activate/' + member_id);
    }

    const queryUserInfo = 'SELECT member_firstname, member_lastname, member_email, member_email_activate FROM Users WHERE member_id = ?';
    
    db.query(queryUserInfo, [member_id], (err, userInfo) => {
        if (err || userInfo.length === 0) {
            req.flash('error', 'ไม่พบข้อมูลสมาชิก');
            return res.redirect('/Account_Register_Activate/' + member_id);
        }

        const { member_firstname, member_lastname, member_email, member_email_activate } = userInfo[0];

        if (code_6_digit !== member_email_activate) {
            req.flash('error', 'รหัสยืนยันที่อยู่อีเมล์ 6 หลักไม่ถูกต้อง');
            return res.redirect('/Account_Register_Activate/' + member_id);
        }

        const email_activate = "ACTIVATE";

        const updateQuery = 'UPDATE Users SET member_email_activate = ? WHERE member_id = ?';
        
        db.query(updateQuery, [email_activate, member_id], (err, result) => {
            if (err) {
                console.log(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการยืนยันที่อยู่อีเมล์');
                return res.redirect('/Account_Register_Activate/' + member_id);
            }

            // ส่งอีเมล
            if (member_email) {
                // Generate a timestamp-based ID: YYYYMMDDHHMMSS
                const now = new Date();
                const Mail_Id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: `${settings.mail_auto_sent}`, pass: `${settings.mail_app_password}` }
                });
            
                const mailOptions = {
                    from: `${settings.mail_name} <${settings.mail_auto_sent}>`,
                    to: member_email,
                    subject: '[POSMS] แจ้งเตือนการยืนยันที่อยู่อีเมล์ #' + Mail_Id,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                            <h1 style="color: #ffffff; text-align: center;">
                                สวัสดีคุณ ${member_firstname} ${member_lastname}
                            </h1>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333333;"><strong>คุณได้ยืนยันที่อยู่อีเมล์แล้ว</strong></div>
                                <hr style="border: 1px solid #e0e0e0;">
                                <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${member_firstname} ${member_lastname}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>ยืนยันที่อยู่อีเมล์</strong> ${member_email} (ยืนยันแล้ว)</div>
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

            req.flash('success', 'ยืนยันที่อยู่อีเมล์สำเร็จ');
            res.redirect('/');
        });
    });
};