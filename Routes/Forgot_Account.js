const nodemailer = require('nodemailer');

exports.getForgotAccountPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'FORGOT ACCOUNT - ' + settings.text_footer;
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Forgot_Account', { title, error: error[0], formData, success: success[0] });
};