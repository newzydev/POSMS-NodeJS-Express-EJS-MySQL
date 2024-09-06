const nodemailer = require('nodemailer');

exports.getShopOwnerProfilePage = (req, res) => {
    const title = 'Profile | Point Of Sale Management System';
    const your_page = 'Profile';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Shop_Owner/Profile', { title, your_page, error: error[0], formData, success: success[0] });
};

exports.postShopOwnerChangeProfile = (req, res) => {
    const { member_id, firstname, lastname, member_tel } = req.body;

    if (!firstname || !lastname || !member_tel) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { firstname, lastname, member_tel });
        return res.redirect('/Role/Shop_Owner/Page/Profile');
    }

    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_tel = ? WHERE member_id = ?';

    db.query(query, [firstname, lastname, member_tel, member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขบัญชีผู้ใช้');
            req.flash('formData', { firstname, lastname, member_tel });
            res.redirect('/Role/Shop_Owner/Page/Profile');
        } else {
            req.flash('success', 'บันทึกข้อมูลบัญชีผู้ใช้สำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Profile');
        }
    });
};

exports.postShopOwnerChangeEmail = (req, res) => {
    const { member_id, old_email, new_email, confirm_new_email } = req.body;
    const user = res.locals.user;

    if (!old_email || !new_email || !confirm_new_email) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_email, new_email, confirm_new_email });
        return res.redirect('/Role/Shop_Owner/Page/Profile');
    }

    if (new_email !== confirm_new_email) {
        req.flash('error', 'ที่อยู่อีเมล์ และการยืนยันที่อยู่อีเมล์ไม่ตรงกัน');
        req.flash('formData', { new_email, confirm_new_email });
        return res.redirect('/Role/Shop_Owner/Page/Profile');
    }

    const query = 'SELECT member_email FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบที่อยู่อีเมล์');
            req.flash('formData', { old_email, new_email, confirm_new_email });
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        const user_me = result[0];

        if (old_email !== user_me.member_email) {
            req.flash('error', 'ที่อยู่อีเมล์เดิมไม่ถูกต้อง');
            req.flash('formData', { old_email, new_email, confirm_new_email });
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_email = ? WHERE member_id = ?';
        db.query(updateQuery, [new_email, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขที่อยู่อีเมล์');
                req.flash('formData', { old_email, new_email, confirm_new_email });
                return res.redirect('/Role/Shop_Owner/Page/Profile');
            }

            // ส่งอีเมล
            if (new_email) {
                // Generate a timestamp-based ID: YYYYMMDDHHMMSS
                const now = new Date();
                const Mail_Id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: 'posms.newzydev@gmail.com', pass: 'qdai jiww yzhh gtfl' }
                });
            
                const mailOptions = {
                    from: 'POSMS TEAM <posms.newzydev@gmail.com>',
                    to: new_email,
                    subject: 'แจ้งเตือนการเปลี่ยนแปลงที่อยู่อีเมล์ เลขที่ #'+ Mail_Id + ' - เรียน คุณ ' + user.member_firstname + ' ' + user.member_lastname,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                            <h1 style="color: #2c3e50; text-align: center;">
                                ยินดีต้อนรับ คุณ ${user.member_firstname} ${user.member_lastname}
                            </h1>
                            <div style="font-size: 16px; color: #34495e; text-align: center;">
                                เลขที่ #${Mail_Id}
                            </div>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333;"><strong>รหัสสมาชิก :</strong> ${user.member_id}</div>
                                <div style="font-size: 16px; color: #333;"><strong>ชื่อ - นามสกุล :</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                <div style="font-size: 16px; color: #333;"><strong>เปลี่ยนที่อยู่อีเมล์เป็น :</strong> ${new_email} (สำเร็จ)</div>
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
            
            req.flash('success', 'บันทึกข้อมูลรหัสผ่านสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Profile');
        });
    });
};

exports.postShopOwnerChangePassword = (req, res) => {
    const { member_id, old_password, new_password, confirm_new_password } = req.body;

    if (!old_password || !new_password || !confirm_new_password) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_password, new_password, confirm_new_password });
        return res.redirect('/Role/Shop_Owner/Page/Profile');
    }

    if (new_password !== confirm_new_password) {
        req.flash('error', 'รหัสผ่าน และการยืนยันรหัสผ่านไม่ตรงกัน');
        req.flash('formData', { new_password, confirm_new_password });
        return res.redirect('/Role/Shop_Owner/Page/Profile');
    }

    const query = 'SELECT member_password FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        const user = result[0];

        if (old_password !== user.member_password) {
            req.flash('error', 'รหัสผ่านเดิมไม่ถูกต้อง');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Shop_Owner/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_password = ? WHERE member_id = ?';
        db.query(updateQuery, [new_password, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน');
                req.flash('formData', { old_password, new_password, confirm_new_password });
                return res.redirect('/Role/Shop_Owner/Page/Profile');
            }
            
            req.flash('success', 'บันทึกข้อมูลรหัสผ่านสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Profile');
        });
    });
};