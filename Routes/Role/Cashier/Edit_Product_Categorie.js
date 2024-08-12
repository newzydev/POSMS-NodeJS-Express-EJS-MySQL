exports.getEditProductCategoriePage = (req, res) => {
    const title = 'Edit Product Categories | Point Of Sale Management System';
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
            res.render('Role/Cashier/Edit_Product_Categorie', { 
                title, 
                your_page,
                product_cat: result[0] 
            });
        }
    });
};

exports.postEditProductCategorie = (req, res) => {
    const cat_id = req.params.cat_id;
    const { cat_name_main, cat_name_sub } = req.body;
    const query = 'UPDATE Categories SET cat_name_main = ?, cat_name_sub = ? WHERE cat_id = ?';
    
    db.query(query, [cat_name_main, cat_name_sub, cat_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Edit_Product_Categorie/Edit/' + cat_id);
        } else {
            res.redirect('/Role/Cashier/Page/Manage_Product_Categories');
        }
    });
};