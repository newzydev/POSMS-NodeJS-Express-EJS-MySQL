exports.getViewProductPage = (req, res) => {
    const title = 'View Product | Point Of Sale Management System';
    const your_page = 'Manage_Products';
    const product_id = req.params.product_id;
    
    const dataQuery = `
        SELECT 
            Products.product_id, 
            Products.product_name, 
            Products.product_price,
            Categories.cat_id, 
            Categories.cat_name_main, 
            Categories.cat_name_sub 
        FROM 
            Products 
        INNER JOIN 
            Categories 
        ON 
            Products.cat_id = Categories.cat_id 
        WHERE
            product_id = ?
    `;
    
    db.query(dataQuery, [product_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Manage_Product');
        } else {
            res.render('Role/Cashier/View_Product', { 
                title, 
                your_page,
                product: result[0]
            });
        }
    });
};