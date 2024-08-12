exports.getDeleteProductCategoriePage = (req, res) => {
    const cat_id = req.params.cat_id;
    const query = 'DELETE FROM Categories WHERE cat_id = ?';
    
    db.query(query, [cat_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        } else {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};