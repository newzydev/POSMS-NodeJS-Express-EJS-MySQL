exports.getEditProductCategoriePage = (req, res) => {
    const title = 'Edit Product Categories | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const success = req.flash('success');
    const cat_id = req.params.cat_id;
    
    const dataQuery = `
        SELECT * FROM 
        Categories 
        WHERE cat_id = ?
    `;
    
    db.query(dataQuery, [cat_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        } else {
            res.render('Role/Cashier/Edit_Product_Categorie', { 
                title, 
                your_page,
                error: error[0],
                success: success[0],
                product_cat: result[0] 
            });
        }
    });
};

exports.postEditProductCategorie = (req, res) => {
    const cat_id = req.params.cat_id;
    const { cat_name_main, cat_name_sub } = req.body;

    if (!cat_name_main || !cat_name_sub) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        return res.redirect('/Role/Cashier/Page/Edit_Product_Categorie/Edit/' + cat_id);
    }

    const query = 'UPDATE Categories SET cat_name_main = ?, cat_name_sub = ? WHERE cat_id = ?';
    
    db.query(query, [cat_name_main, cat_name_sub, cat_id], (err, result) => {
        if (err) {
            req.flash('error', 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่สินค้า');
            res.redirect('/Role/Cashier/Page/Edit_Product_Categorie/Edit/' + cat_id);
        } else {
            req.flash('success', 'แก้ไขหมวดหมู่สินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};