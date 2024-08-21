exports.getShopOwnerDashbordPage = (req, res) => {
    const title = 'Dashbord | Point Of Sale Management System';
    const your_page = 'Dashbord';
    const error = req.flash('error');
    const success = req.flash('success');

    // Existing queries
    const dashQuery0 = "SELECT COUNT(*) AS total_shop_owner FROM Users WHERE role_id = 'ROLE001';";
    const dashQuery1 = "SELECT COUNT(*) AS total_employees FROM Users WHERE role_id IN ('ROLE001', 'ROLE002');";
    const dashQuery2 = "SELECT COUNT(*) AS total_customers FROM Users WHERE role_id = 'ROLE003';";
    const dashQuery3 = "SELECT COUNT(*) AS total_payments FROM Payment_Options;";
    const dashQuery4 = "SELECT SUM(net_total) AS total_net_amount FROM Orders;";
    const dashQuery5 = "SELECT COUNT(*) AS total_orders FROM Orders;";
    const dashQuery6 = "SELECT COUNT(*) AS total_products FROM Products;";
    const dashQuery7 = "SELECT COUNT(DISTINCT cat_name_main) AS total_categories FROM Categories;";

    // Updated query for payment methods
    const paymentMethodsQuery = `
        SELECT p.pay_cat_name AS payment_method, COUNT(o.pay_id) AS count
        FROM Orders o
        JOIN Payment_Options p ON o.pay_id = p.pay_id
        GROUP BY p.pay_cat_name;
    `;

    // Query for top 12 products
    // const topProductsQuery = `
    //     SELECT product_name, SUM(cart_product_qty) AS total_qty
    //     FROM Order_Product_Lists
    //     GROUP BY product_name
    //     ORDER BY total_qty DESC
    //     LIMIT 12;
    // `;
    const topProductsQuery = `
        SELECT p.product_name, SUM(opl.cart_product_qty) AS total_qty, p.product_price
        FROM Order_Product_Lists opl
        JOIN Products p ON opl.product_name = p.product_name
        GROUP BY p.product_name, p.product_price
        ORDER BY total_qty DESC
        LIMIT 12;
    `;

    const monthlySalesQuery = `
        SELECT 
            m.month_name,
            IFNULL(SUM(o.net_total), 0) AS total_sales
        FROM 
            (SELECT 
                1 AS month_num, 'มกราคม' AS month_name 
            UNION ALL SELECT 2, 'กุมภาพันธ์'
            UNION ALL SELECT 3, 'มีนาคม'
            UNION ALL SELECT 4, 'เมษายน'
            UNION ALL SELECT 5, 'พฤษภาคม'
            UNION ALL SELECT 6, 'มิถุนายน'
            UNION ALL SELECT 7, 'กรกฎาคม'
            UNION ALL SELECT 8, 'สิงหาคม'
            UNION ALL SELECT 9, 'กันยายน'
            UNION ALL SELECT 10, 'ตุลาคม'
            UNION ALL SELECT 11, 'พฤศจิกายน'
            UNION ALL SELECT 12, 'ธันวาคม') m
        LEFT JOIN 
            Orders o 
            ON m.month_num = MONTH(o.time_order) 
            AND YEAR(o.time_order) = YEAR(CURDATE())
        GROUP BY 
            m.month_num, m.month_name
        ORDER BY 
            m.month_num;
    `;

    db.query(dashQuery0, (err, dashQuery0Results) => {
        if (err) throw err;

        db.query(dashQuery1, (err, dashQuery1Results) => {
            if (err) throw err;
    
            db.query(dashQuery2, (err, dashQuery2Results) => {
                if (err) throw err;
    
                db.query(dashQuery3, (err, dashQuery3Results) => {
                    if (err) throw err;
    
                    db.query(dashQuery4, (err, dashQuery4Results) => {
                        if (err) throw err;
    
                        db.query(dashQuery5, (err, dashQuery5Results) => {
                            if (err) throw err;
    
                            db.query(dashQuery6, (err, dashQuery6Results) => {
                                if (err) throw err;
    
                                db.query(dashQuery7, (err, dashQuery7Results) => {
                                    if (err) throw err;
    
                                    db.query(paymentMethodsQuery, (err, paymentMethodsResults) => {
                                        if (err) throw err;
    
                                        db.query(topProductsQuery, (err, topProductsResults) => {
                                            if (err) throw err;
    
                                            db.query(monthlySalesQuery, (err, monthlySalesResults) => {
                                                if (err) throw err;
                                            
                                                const dashQuery0Re = dashQuery0Results[0].total_shop_owner;
                                                const dashQuery1Re = dashQuery1Results[0].total_employees;
                                                const dashQuery2Re = dashQuery2Results[0].total_customers;
                                                const dashQuery3Re = dashQuery3Results[0].total_payments;
                                                const dashQuery4Re = dashQuery4Results[0].total_net_amount;
                                                const dashQuery5Re = dashQuery5Results[0].total_orders;
                                                const dashQuery6Re = dashQuery6Results[0].total_products;
                                                const dashQuery7Re = dashQuery7Results[0].total_categories;
        
                                                // Process payment methods data
                                                const paymentLabels = paymentMethodsResults.map(row => row.payment_method);
                                                const paymentData = paymentMethodsResults.map(row => row.count);
        
                                                // Process top products data
                                                const topProductLabels = topProductsResults.map(row => row.product_name);
                                                const topProductData = topProductsResults.map(row => row.total_qty);

                                                // Process monthly sales data
                                                const monthlyLabels = monthlySalesResults.map(row => row.month_name);
                                                const monthlyData = monthlySalesResults.map(row => row.total_sales);
        
                                                res.render('Role/Shop_Owner/Dashbord', { 
                                                    title, 
                                                    your_page,
                                                    error: error[0],
                                                    success: success[0],
                                                    dashQuery0Re,
                                                    dashQuery1Re,
                                                    dashQuery2Re,
                                                    dashQuery3Re,
                                                    dashQuery4Re,
                                                    dashQuery5Re,
                                                    dashQuery6Re,
                                                    dashQuery7Re,
                                                    paymentLabels: JSON.stringify(paymentLabels),
                                                    paymentData: JSON.stringify(paymentData),
                                                    topProductLabels: JSON.stringify(topProductLabels),
                                                    topProductData: JSON.stringify(topProductData),
                                                    monthlyLabels: JSON.stringify(monthlyLabels),
                                                    monthlyData: JSON.stringify(monthlyData)
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
