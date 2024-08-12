exports.getLogoutPage = (req, res) => {
    
    res.clearCookie('member_id');
    res.clearCookie('role_id');
    
    const title = 'Logout | Point Of Sale Management System';
    res.render('Logout', { title });
};