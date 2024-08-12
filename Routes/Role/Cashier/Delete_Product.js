exports.getDeleteProductPage = (req, res) => {
    const product_id = req.params.product_id;
    const query = 'DELETE FROM Products WHERE product_id = ?';
    
    db.query(query, [product_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Products');
        } else {
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};