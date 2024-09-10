exports.getEditProductPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'EDIT PRODUCT - ' + settings.text_footer;
    const your_page = 'Manage_Products';
    const error = req.flash('error');
    const success = req.flash('success');
    const product_id = req.params.product_id;

    const dataQuery1 = `
        SELECT DISTINCT cat_name_main
        FROM categories
        ORDER BY cat_name_main ASC;
    `;

    const dataQuery = `
        SELECT Products.*, Categories.cat_name_main, Categories.cat_name_sub
        FROM Products
        INNER JOIN Categories ON Products.cat_id = Categories.cat_id
        WHERE Products.product_id = ?
    `;

    // Query categories
    db.query(dataQuery1, (err, resultCats) => {
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
                        product_cats_main: resultCats,
                        product_cats_sub: [], // เริ่มต้นด้วย array ว่างสำหรับหมวดหมู่ย่อย
                        product: resultProduct
                    });
                }
            });
        }
    });
};

// Endpoint สำหรับดึงหมวดหมู่ย่อย
exports.getSubCategories = (req, res) => {
    const mainCategory = req.params.mainCategory;
    const dataQuery2 = `
        SELECT cat_id, cat_name_sub
        FROM categories
        WHERE cat_name_main = ?
        ORDER BY cat_name_sub ASC;
    `;
    db.query(dataQuery2, [mainCategory], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        res.json(result);
    });
};

exports.postEditProduct = (req, res) => {
    const product_id = req.params.product_id;
    const { cat_id, product_name, product_price, product_unit_number } = req.body;
    const query = 'UPDATE Products SET cat_id = ?, product_name = ?, product_price = ?, product_unit_number = ? WHERE product_id = ?';
    
    db.query(query, [cat_id, product_name, product_price, product_unit_number, product_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขสินค้า');
            res.redirect('/Role/Cashier/Page/Manage_Products/Edit_Product/Edit/' + product_id);
        } else {
            req.flash('success', 'แก้ไขสินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};