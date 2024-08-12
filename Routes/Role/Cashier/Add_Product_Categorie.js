exports.getAddProductCategoriePage = (req, res) => {
    const title = 'Add Product Categorie | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
    res.render('Role/Cashier/Add_Product_Categorie', { title, your_page });
};

exports.postAddProductCategorie = (req, res) => {
    // Get variable
    const { cat_name_main, cat_name_sub } = req.body;
    
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
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories/Add_Product_Categorie');
        } else {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};