exports.getAddProductCategoriePage = (req, res) => {
    const title = 'Add Product Categorie | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Cashier/Add_Product_Categorie', { 
        title, 
        your_page,
        error: error[0], 
        formData, 
        success: success[0]
    });
};

exports.postAddProductCategorie = (req, res) => {
    // Get variable
    const { cat_name_main, cat_name_sub } = req.body;

    if (!cat_name_main || !cat_name_sub) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { cat_name_main, cat_name_sub });
        return res.redirect('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie');
    }
    
    // Generate Member ID
    const generateCatId = () => {
        return 'CT' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const cat_id = generateCatId();

    // Query SQL
    const query = 'INSERT INTO Categories (cat_id, cat_name_main, cat_name_sub) VALUES (?, ?, ?)';
    
    db.query(query, [cat_id, cat_name_main, cat_name_sub], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในเพิ่มหมวดหมู่สินค้า');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie');
        } else {
            req.flash('success', 'เพิ่มข้อมูลหมวดหมู่สินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};