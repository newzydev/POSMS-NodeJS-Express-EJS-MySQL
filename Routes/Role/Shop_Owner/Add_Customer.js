exports.getAddCustomerPage = (req, res) => {
    const title = 'Add Customer | Point Of Sale Management System';
    const your_page = 'Manage_Customer_Users';
    res.render('Role/Shop_Owner/Add_Customer', { title, your_page });
};

exports.postAddCustomer = (req, res) => {
    // Get variable
    const { first_name, last_name, username, password, phone_number } = req.body;
    
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
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users/Add_Customer');
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        }
    });
};