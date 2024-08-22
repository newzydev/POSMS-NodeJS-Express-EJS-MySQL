exports.getSystemSettingPage = (req, res) => {
    const title = 'Order Reciept | Point Of Sale Management System';
    const your_page = 'System_Settings';
    const error = req.flash('error');
    const success = req.flash('success');

    // Query to retrieve system settings from the database
    const query = 'SELECT * FROM Systen_Settings';

    db.query(query, (err, result) => {
        if (err) throw err;

        const settings = result[0];
        res.render('Role/Shop_Owner/System_Settings', { 
            title, 
            your_page,
            error: error[0],
            success: success[0],
            settings
        });
    });
};