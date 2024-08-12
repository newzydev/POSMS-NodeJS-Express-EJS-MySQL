exports.getAddProductPage = (req, res) => {
    const title = 'Add Product | Point Of Sale Management System';
    const your_page = 'Manage_Products';

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
                product_cats: result
            });
        }
    });
};

exports.postAddProduct = (req, res) => {
    // Get variables
    let { Product_id, cat_id, product_name, product_price } = req.body;
    
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
            res.redirect('/Role/Cashier/Page/Manage_Products/Add_Product');
        } else {
            res.redirect('/Role/Cashier/Page/Manage_Products');
        }
    });
};
