exports.getChangePasswordPage = (req, res) => {
    const title = 'Change Password | Point Of Sale Management System';
    res.render('Change_Password', { title });
};