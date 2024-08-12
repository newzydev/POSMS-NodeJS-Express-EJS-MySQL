exports.getDeleteCustomerPage = (req, res) => {
    const member_id = req.params.member_id;
    const query = 'DELETE FROM Users WHERE member_id = ?';
    
    db.query(query, [member_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        } else {
            res.redirect('/Role/Shop_Owner/Page/Manage_Customer_Users');
        }
    });
};