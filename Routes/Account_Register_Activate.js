const nodemailer = require('nodemailer');

exports.getRegisterActivatePage = (req, res) => {
    const title = 'Email Activate | Point Of Sale Management System';
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
                    auth: { user: 'posms.newzydev@gmail.com', pass: 'qdai jiww yzhh gtfl' }
                });
            
                const mailOptions = {
                    from: 'POSMS TEAM <posms.newzydev@gmail.com>',
                    to: member_email,
                    subject: 'แจ้งเตือนการยืนยันที่อยู่อีเมล์ เลขที่ #' + Mail_Id + ' - เรียน คุณ ' + member_firstname + ' ' + member_lastname,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                            <h1 style="color: #2c3e50; text-align: center;">
                                ยินดีต้อนรับ คุณ ${member_firstname} ${member_lastname}
                            </h1>
                            <div style="font-size: 16px; color: #34495e; text-align: center;">
                                เลขที่ #${Mail_Id}
                            </div>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333;"><strong>รหัสสมาชิก :</strong> ${member_id}</div>
                                <div style="font-size: 16px; color: #333;"><strong>ชื่อ - นามสกุล :</strong> ${member_firstname} ${member_lastname}</div>
                                <div style="font-size: 16px; color: #333;"><strong>ยืนยันที่อยู่อีเมล์ :</strong> ${member_email} (ยืนยันแล้ว)</div>
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
            } else {
                console.log('ไม่พบที่อยู่อีเมล์ของผู้รับ');
            }

            req.flash('success', 'ยืนยันที่อยู่อีเมล์สำเร็จ');
            res.redirect('/');
        });
    });
};