exports.getSystemSettingPage = (req, res) => {
    const title = 'Order Reciept | Point Of Sale Management System';
    const your_page = 'System_Settings';
    const error = req.flash('error');
    const success = req.flash('success');
    
    res.render('Role/Shop_Owner/System_Settings', { 
        title, 
        your_page,
        error: error[0],
        success: success[0]
    });
};