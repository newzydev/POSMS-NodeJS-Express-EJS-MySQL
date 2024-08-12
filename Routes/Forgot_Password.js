exports.getForgotPasswordPage = (req, res) => {
    const title = 'Forgot Password | Point Of Sale Management System';
    res.render('Forgot_Password', { title });
};