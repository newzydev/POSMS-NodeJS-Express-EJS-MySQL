exports.getAddProductPage = (req, res) => {
    const title = 'Add Product | Point Of Sale Management System';
    const your_page = 'Manage_Products';
    const error = req.flash('error');
    const formData = req.flash('formData')[0] || {};
    const success = req.flash('success');

    const dataQuery = `
        SELECT 
            cat_id, 
            cat_name_main,
            cat_name_sub
        FROM 
            Categories 
        ORDER BY 
            cat_name_main ASC, time_order DESC
    `;


    db.query(dataQuery, (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Products');
        } else {
            res.render('Role/Cashier/Add_Product', { 
                title, 
                your_page,
                error: error[0], 
                formData, 
                success: success[0],
                product_cats: result
            });
        }
    });
};

exports.postAddProduct = (req, res) => {
    // Get variables
    let { Product_id, cat_id, product_name, product_price } = req.body;

    if (!cat_id || !product_name || !product_price) {
        req.flash('error', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย (*) ให้ครบทุกช่อง');
        req.flash('formData', { Product_id, cat_id, product_name, product_price });
        return res.redirect('/Role/Cashier/Page/Manage_Products/Add_Product');
    }
    
    // Generate Product ID
    const generateProductId = () => {
        return 'PD' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const Product_id_auto = generateProductId();

    if (!Product_id) {
        Product_id = Product_id_auto;
    }

    // Query SQL
    const query = 'INSERT INTO Products (Product_id, cat_id, product_name, product_price) VALUES (?, ?, ?, ?)';
    
    db.query(query, [Product_id, cat_id, product_name, product_price], (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในเพิ่มสินค้า');
            res.redirect('/Role/Cashier/Page/Manage_Products/Add_Product');
        } else {
            req.flash('success', 'เพิ่มข้อมูลสินค้าสำเร็จ');
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};
