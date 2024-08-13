exports.getLogoutPage = (req, res) => {
    res.clearCookie('MEMBER_TOKEN');
    res.clearCookie('ROLE_TOKEN');
    
    const title = 'Logout | Point Of Sale Management System';
    res.render('Logout', { title });
};