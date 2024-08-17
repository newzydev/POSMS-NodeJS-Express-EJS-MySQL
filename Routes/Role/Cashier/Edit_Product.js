exports.getEditProductPage = (req, res) => {
    const title = 'Edit Product | Point Of Sale Management System';
    const your_page = 'Manage_Products';
    const error = req.flash('error');
    const success = req.flash('success');
    const product_id = req.params.product_id;

    const dataQueryCats = `
        SELECT 
            cat_id, 
            cat_name_main,
            cat_name_sub
        FROM 
            Categories 
        ORDER BY 
            cat_name_main ASC, time_order DESC
    `;

    const dataQuery = `
        SELECT * FROM 
        Products 
        WHERE product_id = ?
    `;

    // Query categories
    db.query(dataQueryCats, (err, resultCats) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Products');
        } else {
            // Query product
            db.query(dataQuery, [product_id], (err2, resultProduct) => {
                if (err2) {
                    res.redirect('/Role/Cashier/Page/Manage_Products');
                } else {
                    res.render('Role/Cashier/Edit_Product', { 
                        title, 
                        your_page,
                        error: error[0],
                        success: success[0],
                        product_cats: resultCats,
                        product: resultProduct
                    });
                }
            });
        }
    });
};

exports.postEditProduct = (req, res) => {
    const product_id = req.params.product_id;
    const { cat_id, product_name, product_price } = req.body;
    const query = 'UPDATE Products SET cat_id = ?, product_name = ?, product_price = ? WHERE product_id = ?';
    
    db.query(query, [cat_id, product_name, product_price, product_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขสินค้า');
            res.redirect('/Role/Cashier/Page/Manage_Products/Edit_Product/Edit/' + product_id);
        } else {
            req.flash('success', 'แก้ไขสินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};