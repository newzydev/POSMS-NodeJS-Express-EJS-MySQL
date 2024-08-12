exports.getDeletePaymentMethodPage = (req, res) => {
    const pay_id = req.params.pay_id;
    const query = 'DELETE FROM Payment_Options WHERE pay_id = ?';
    
    db.query(query, [pay_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};