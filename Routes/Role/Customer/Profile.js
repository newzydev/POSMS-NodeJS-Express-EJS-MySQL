exports.getCustomerProfilePage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'PROFILE - ' + settings.text_footer;
    const your_page = 'Profile';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Customer/Profile', { title, your_page, error: error[0], formData, success: success[0] });
};

// Account Settings
exports.postCustomerChangeProfile = (req, res) => {
    const { member_id, firstname, lastname, member_tel } = req.body;

    if (!firstname || !lastname || !member_tel) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { firstname, lastname, member_tel });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'UPDATE Users SET member_firstname = ?, member_lastname = ?, member_tel = ? WHERE member_id = ?';

    db.query(query, [firstname, lastname, member_tel, member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขบัญชีผู้ใช้');
            req.flash('formData', { firstname, lastname, member_tel });
            res.redirect('/Role/Customer/Page/Profile');
        } else {
            req.flash('success', 'บันทึกข้อมูลบัญชีผู้ใช้สำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        }
    });
};
// Account Settings End

// Change Email
exports.postCustomerChangeEmail = (req, res) => {
    const settings = res.locals.settings;
    const { member_id, old_email, new_email, confirm_new_email } = req.body;
    const user = res.locals.user;

    if (!old_email || !new_email || !confirm_new_email) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_email, new_email, confirm_new_email });
        return res.redirect('/Role/Customer/Page/Profile');
    }
    
    if (new_email !== confirm_new_email) {
        req.flash('error', 'ที่อยู่อีเมล์ และการยืนยันที่อยู่อีเมล์ไม่ตรงกัน');
        req.flash('formData', { new_email, confirm_new_email });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_email || confirm_new_email === old_email) {
        req.flash('error', 'ไม่สามารถเปลี่ยนไปใช้ที่อยู่อีเมล์เดิมได้');
        req.flash('formData', { old_email,  });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'SELECT member_email FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบที่อยู่อีเมล์');
            req.flash('formData', { old_email, new_email, confirm_new_email });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const user_me = result[0];

        if (old_email !== user_me.member_email) {
            req.flash('error', 'ที่อยู่อีเมล์เดิมไม่ถูกต้อง');
            req.flash('formData', { old_email, new_email, confirm_new_email });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_email = ? WHERE member_id = ?';
        db.query(updateQuery, [new_email, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขที่อยู่อีเมล์');
                req.flash('formData', { old_email, new_email, confirm_new_email });
                return res.redirect('/Role/Customer/Page/Profile');
            }

            // ส่งอีเมล
            if (new_email) {
                // Generate a timestamp-based ID: YYYYMMDDHHMMSS
                const now = new Date();
                const Mail_Id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: `${settings.mail_auto_sent}`, pass: `${settings.mail_app_password}` }
                });
            
                const mailOptions = {
                    from: `${settings.mail_name} <${settings.mail_auto_sent}>`,
                    to: new_email,
                    subject: '[POSMS] แจ้งเตือนการเปลี่ยนแปลงที่อยู่อีเมล์ #' + Mail_Id,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                            <h1 style="color: #ffffff; text-align: center;">
                                สวัสดีคุณ ${user.member_firstname} ${user.member_lastname}
                            </h1>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333333;"><strong>คุณได้เปลี่ยนที่อยู่อีเมล์</strong></div>
                                <hr style="border: 1px solid #e0e0e0;">
                                <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>ที่อยู่อีเมล์เดิมของคุณ</strong> ${user.member_email}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>เปลี่ยนที่อยู่อีเมล์เป็น</strong> ${new_email} (สำเร็จ)</div>
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
            
            req.flash('success', 'บันทึกข้อมูลรหัสผ่านสำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        });
    });
};
// Change Email End

// Change Username
exports.postCustomerChangeUsername = (req, res) => {
    const settings = res.locals.settings;
    const { member_id, old_username, new_username, confirm_new_username } = req.body;

    if (!old_username || !new_username || !confirm_new_username) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_username, new_username, confirm_new_username });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_username !== confirm_new_username) {
        req.flash('error', 'ชื่อผู้ใช้ และการยืนยันชื่อผู้ใช้ไม่ตรงกัน');
        req.flash('formData', { new_username, confirm_new_username });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_username || confirm_new_username === old_username) {
        req.flash('error', 'ไม่สามารถเปลี่ยนไปใช้ชื่อผู้ใช้เดิมได้');
        req.flash('formData', { old_email,  });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'SELECT member_username FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้');
            req.flash('formData', { old_username, new_username, confirm_new_username });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const user = result[0];

        if (old_username !== user.member_username) {
            req.flash('error', 'ชื่อผู้ใช้เดิมไม่ถูกต้อง');
            req.flash('formData', { old_username, new_username, confirm_new_username });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_username = ? WHERE member_id = ?';
        db.query(updateQuery, [new_username, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขชื่อผู้ใช้');
                req.flash('formData', { old_username, new_username, confirm_new_username });
                return res.redirect('/Role/Customer/Page/Profile');
            }

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
                    subject: '[POSMS] แจ้งเตือนการเปลี่ยนแปลงชื่อผู้ใช้ #' + Mail_Id,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                            <h1 style="color: #ffffff; text-align: center;">
                                สวัสดีคุณ คุณ ${user.member_firstname} ${user.member_lastname}
                            </h1>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333333;"><strong>คุณได้เปลี่ยนแปลงชื่อผู้ใช้</strong></div>
                                <hr style="border: 1px solid #e0e0e0;">
                                <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>เปลี่ยนชื่อผู้ใช้เป็น</strong> ${new_username} (สำเร็จ)</div>
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
            
            req.flash('success', 'บันทึกข้อมูลชื่อผู้ใช้สำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        });
    });
};
// Change Username End

// Change Password
exports.postCustomerChangePassword = (req, res) => {
    const settings = res.locals.settings;
    const { member_id, old_password, new_password, confirm_new_password } = req.body;

    if (!old_password || !new_password || !confirm_new_password) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { old_password, new_password, confirm_new_password });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_password !== confirm_new_password) {
        req.flash('error', 'รหัสผ่าน และการยืนยันรหัสผ่านไม่ตรงกัน');
        req.flash('formData', { new_password, confirm_new_password });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    if (new_password || confirm_new_password === old_password) {
        req.flash('error', 'ไม่สามารถเปลี่ยนไปใช้รหัสผ่านเดิมได้');
        req.flash('formData', { old_email,  });
        return res.redirect('/Role/Customer/Page/Profile');
    }

    const query = 'SELECT member_password FROM Users WHERE member_id = ?';
    db.query(query, [member_id], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        if (result.length === 0) {
            req.flash('error', 'ไม่พบบัญชีผู้ใช้');
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const user = result[0];

        if (old_password !== user.member_password) {
            req.flash('error', 'รหัสผ่านเดิมไม่ถูกต้อง');
            req.flash('formData', { old_password, new_password, confirm_new_password });
            return res.redirect('/Role/Customer/Page/Profile');
        }

        const updateQuery = 'UPDATE Users SET member_password = ? WHERE member_id = ?';
        db.query(updateQuery, [new_password, member_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน');
                req.flash('formData', { old_password, new_password, confirm_new_password });
                return res.redirect('/Role/Customer/Page/Profile');
            }

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
                    subject: '[POSMS] แจ้งเตือนการเปลี่ยนแปลงรหัสผ่าน #' + Mail_Id,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 20px; background-image: linear-gradient(90deg, #0F1975, #0B21ED);">
                            <h1 style="color: #ffffff; text-align: center;">
                                สวัสดีคุณ คุณ ${user.member_firstname} ${user.member_lastname}
                            </h1>
                            <div style="background-color: #ffffff; padding: 15px; border-radius: 0.5rem; margin: 20px 0; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                <div style="font-size: 16px; color: #333333;"><strong>คุณได้เปลี่ยนแปลงรหัสผ่าน</strong></div>
                                <hr style="border: 1px solid #e0e0e0;">
                                <div style="font-size: 16px; color: #333333;"><strong>บัญชี</strong> ${user.member_firstname} ${user.member_lastname}</div>
                                <div style="font-size: 16px; color: #333333;"><strong>เปลี่ยนรหัสผ่านเป็น</strong> ${new_password} (สำเร็จ)</div>
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
            
            req.flash('success', 'บันทึกข้อมูลรหัสผ่านสำเร็จ');
            res.redirect('/Role/Customer/Page/Profile');
        });
    });
};
// Change Password End