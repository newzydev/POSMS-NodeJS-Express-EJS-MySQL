exports.getRegisterPage = (req, res) => {
    const title = 'Register | Point Of Sale Management System';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Register', { title, error: error[0], formData, success: success[0] });
};

exports.postRegister = (req, res) => {
    // Get variables
    const { first_name, last_name, username, password, confirm_password, phone_number } = req.body;

    if (!first_name || !last_name || !username || !password || !confirm_password || !phone_number) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { first_name, last_name, username, phone_number });
        return res.redirect('/Register');
    }

    if (password !== confirm_password) {
        req.flash('error', 'รหัสผ่าน และการยืนยันรหัสผ่านไม่ตรงกัน');
        req.flash('formData', { first_name, last_name, username, password, confirm_password, phone_number });
        return res.redirect('/Register');
    }
    
    // Check if phone number already exists
    const checkPhoneNumberQuery = 'SELECT COUNT(*) AS count FROM Users WHERE member_tel = ?';
    
    db.query(checkPhoneNumberQuery, [phone_number], (err, results) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบหมายเลขโทรศัพท์');
            req.flash('formData', { first_name, last_name, username, phone_number });
            return res.redirect('/Register');
        }

        if (results[0].count > 0) {
            req.flash('error', 'หมายเลขโทรศัพท์มือถือนี้ถูกใช้ไปแล้ว');
            req.flash('formData', { first_name, last_name, username, password, confirm_password, phone_number });
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

        // Query SQL
        const query = 'INSERT INTO Users (member_id, member_firstname, member_lastname, member_username, member_password, member_tel, role_id, member_time_register, member_time_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [member_id, first_name, last_name, username, password, phone_number, role_id, member_time_register, member_time_login], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
                req.flash('formData', { first_name, last_name, username, phone_number });
                return res.redirect('/Register');
            } else {
                req.flash('success', 'สมัครสมาชิกสำเร็จ');
                res.redirect('/Login');
            }
        });
    });
};
