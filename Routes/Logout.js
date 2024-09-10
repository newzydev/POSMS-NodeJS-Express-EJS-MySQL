exports.getLogoutPage = (req, res) => {
    const settings = res.locals.settings;

    res.clearCookie('MEMBER_TOKEN');
    res.clearCookie('ROLE_TOKEN');
    
    const title = 'LOGOUT - ' + settings.text_footer;
    res.render('Logout', { title });
};