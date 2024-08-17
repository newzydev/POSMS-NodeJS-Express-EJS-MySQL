exports.getDeletePaymentMethodPage = (req, res) => {
    const pay_id = req.params.pay_id;
    const query = 'DELETE FROM Payment_Options WHERE pay_id = ?';
    
    db.query(query, [pay_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        } else {
            req.flash('success', 'ลบข้อมูลรูปแบบชำระเงินสำเร็จ');
            res.redirect('/Role/Shop_Owner/Page/Manage_Payment_Methods');
        }
    });
};