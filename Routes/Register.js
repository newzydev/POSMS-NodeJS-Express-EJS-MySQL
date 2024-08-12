exports.getRegisterPage = (req, res) => {
    const title = 'Register | Point Of Sale Management System';
    res.render('Register', { title, formData: {} });
};

exports.postRegister = (req, res) => {
    // Get variable
    const { first_name, last_name, username, password, confirm_password, phone_number } = req.body;

    if (!first_name || !last_name || !username || !password || !confirm_password || !phone_number) {
        return res.render('Register', {
            title: 'Register | Point Of Sale Management System',
            error: 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง',
            formData: { first_name, last_name, username, phone_number }
        });
    }

    if (password !== confirm_password) {
        return res.render('Register', {
            title: 'Register | Point Of Sale Management System',
            error: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน',
            formData: { first_name, last_name, username, phone_number }
        });
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
            res.redirect('/Register');
        } else {
            res.redirect('/Login');
        }
    });
};