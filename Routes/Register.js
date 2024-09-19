const nodemailer = require('nodemailer');

exports.getRegisterPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'REGISTER - ' + settings.text_footer;
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Register', { title, error: error[0], formData, success: success[0] });
};

exports.postRegister = (req, res) => {
    // Get variables
    const { member_firstname, member_lastname, member_username, member_password, member_email, member_tel } = req.body;

    if (!member_firstname || !member_lastname || !member_username || !member_password || !member_email || !member_tel) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { member_firstname, member_lastname, member_username, member_password, member_email, member_tel });
        return res.redirect('/Register');
    }
    
    // Check if phone number already exists
    const checkPhoneNumberQuery = 'SELECT COUNT(*) AS count FROM Users WHERE member_tel = ?';
    
    db.query(checkPhoneNumberQuery, [member_tel], (err, results) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์');
            req.flash('formData', { member_firstname, member_lastname, member_email, member_tel });
            return res.redirect('/Register');
        }

        if (results[0].count > 0) {
            req.flash('error', 'หมายเลขโทรศัพท์มือถือนี้ถูกใช้ไปแล้ว');
            req.flash('formData', { member_firstname, member_lastname, member_email, member_tel });
            return res.redirect('/Register');
        }

        // Generate Member ID
        const generateMemberId = () => {
            return 'MB' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
        };
        const member_id = generateMemberId();

        // Set Date and Time Register
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
        const role_id = "ROLE003";
        const member_time_register = formattedDate + ' ' + formattedTime;
        const member_time_login = formattedDate + ' ' + formattedTime;
        const code_6_digit = Math.floor(100000 + Math.random() * 900000).toString();
        const member_email_activate = code_6_digit;

        // Query SQL
        const query = 'INSERT INTO Users (member_id, member_firstname, member_lastname, member_username, member_password, member_email, member_email_activate, member_tel, role_id, member_time_register, member_time_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [member_id, member_firstname, member_lastname, member_username, member_password, member_email, member_email_activate, member_tel, role_id, member_time_register, member_time_login], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
                req.flash('formData', { member_firstname, member_lastname, member_username, member_password, member_email, member_email_activate, member_tel });
                return res.redirect('/Register');
            } else {

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
                        subject: 'แจ้งเตือนขอบคุณที่สมัครสมาชิกกับเรา เลขที่ #'+ Mail_Id + ' - เรียน คุณ ' + member_firstname + ' ' + member_lastname,
                        html: `
                            <p style="font-size: 14px; color: #333333; text-align: center;">
                                E-MAIL AUTO SENT #${Mail_Id}
                            </p>
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                                <h1 style="color: #ffffff; text-align: center;">
                                    ยินดีต้อนรับ คุณ ${member_firstname} ${member_lastname}
                                </h1>
                                <div style="background-color: #ffffff; padding: 15px; margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                    <div style="font-size: 16px; color: #333333;"><strong>รหัสสมาชิก</strong> ${member_id}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>ชื่อเต็ม</strong> ${member_firstname} ${member_lastname}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>สมัครสมาชิก</strong> ${member_time_register}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>ชื่อผู้ใช้ของคุณ</strong> ${member_username}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>รหัสผ่านของคุณ</strong> ${member_password}</div>
                                    <div style="font-size: 16px; color: #333333;"><strong>รหัส OTP ยืนยัน 6 หลัก</strong> ${member_email_activate}</div>
                                </div>
                                <p style="font-size: 14px; color: #ffffff; text-align: center;">
                                    (อีเมล์ฉบับนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมล์ฉบับนี้)
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

                req.flash('success', 'สมัครสมาชิกสำเร็จ');
                res.redirect('/Account_Register_Activate/' + member_id);
            }
        });
    });
};
