exports.getAddMainProductCategoriePage = (req, res) => {
    const title = 'Add Product Categorie Main | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');
    res.render('Role/Cashier/Add_Main_Product_Categorie', { 
        title, 
        your_page,
        error: error[0], 
        formData, 
        success: success[0]
    });
};

exports.postAddMainProductCategorie = (req, res) => {
    // Get variable
    const { cat_main_name } = req.body;

    if (!cat_main_name) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { cat_main_name });
        return res.redirect('/Role/Cashier/Page/Manage_Product_Categories_Main/Add_Main_Product_Categorie');
    }
    
    // Generate Categorie Main ID
    const generateCatMainId = () => {
        return 'CM' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const cat_main_id = generateCatMainId();

    // Query SQL
    const query = 'INSERT INTO Categories_Main (cat_main_id, cat_main_name) VALUES (?, ?)';
    
    db.query(query, [cat_main_id, cat_main_name], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในเพิ่มหมวดหมู่สินค้าหลัก');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories_Main/Add_Main_Product_Categorie');
        } else {
            req.flash('success', 'เพิ่มข้อมูลหมวดหมู่สินค้าหลัก "' + cat_main_name + '" สำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories_Main/Add_Main_Product_Categorie');
        }
    });
};