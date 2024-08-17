exports.getDeleteProductCategoriePage = (req, res) => {
    const cat_id = req.params.cat_id;
    const query = 'DELETE FROM Categories WHERE cat_id = ?';
    
    db.query(query, [cat_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        } else {
            req.flash('success', 'ลบข้อมูลหมวดหมู่สินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};