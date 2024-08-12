exports.getViewProductCategoriePage = (req, res) => {
    const title = 'View Product Categories | Point Of Sale Management System';
    const your_page = 'Manage_Product_Categories';
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
            res.render('Role/Cashier/View_Product_Categorie', { 
                title, 
                your_page,
                product_cat: result[0] 
            });
        }
    });
};