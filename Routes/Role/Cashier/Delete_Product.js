exports.getDeleteProductPage = (req, res) => {
    const product_id = req.params.product_id;
    const query = 'DELETE FROM Products WHERE product_id = ?';
    
    db.query(query, [product_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            res.redirect('/Role/Cashier/Page/Manage_Products');
        } else {
            req.flash('success', 'ลบข้อมูลสินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};