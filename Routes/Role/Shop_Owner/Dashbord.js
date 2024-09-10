exports.getShopOwnerDashbordPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'DASHBORD - ' + settings.text_footer;
    const your_page = 'Dashbord';
    const error = req.flash('error');
    const success = req.flash('success');

    // สรุปข้อมูลพื้นฐาน
    const dashQuery0 = "SELECT COUNT(*) AS total_shop_owner FROM Users WHERE role_id = 'ROLE001';";
    const dashQuery1 = "SELECT COUNT(*) AS total_employees FROM Users WHERE role_id IN ('ROLE001', 'ROLE002');";
    const dashQuery2 = "SELECT COUNT(*) AS total_customers FROM Users WHERE role_id = 'ROLE003';";
    const dashQuery3 = "SELECT COUNT(*) AS total_payments FROM Payment_Options;";
    const dashQuery4 = "SELECT SUM(net_total) AS total_net_amount FROM Orders;";
    const dashQuery5 = "SELECT COUNT(*) AS total_orders FROM Orders;";
    const dashQuery6 = "SELECT COUNT(*) AS total_products FROM Products;";
    const dashQuery7 = "SELECT COUNT(DISTINCT cat_name_main) AS total_categories_main FROM Categories;";
    const dashQuery8 = "SELECT COUNT(DISTINCT cat_name_sub) AS total_categories_sub FROM Categories;";

    // แสดงยอดขายแต่ละเดือน (ก่อนหน้า - ปัจจุบัน - ทุกปี)
    const monthlySalesOldQuery = `
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
            AND YEAR(o.time_order) = YEAR(CURDATE()) - 1
        GROUP BY 
            m.month_num, m.month_name
        ORDER BY 
            m.month_num;
    `;
    const monthlySalesPresentQuery = `
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
    const monthlySalesAllQuery = `
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
        GROUP BY 
            m.month_num, m.month_name
        ORDER BY 
            m.month_num;
    `;
    
    // แสดงสินค้ายอดนิยม 12 รายการ (ก่อนหน้า - ปัจจุบัน - ทุกปี)
    const topProductsOldQuery = `
        SELECT product_name, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE()) - 1
        GROUP BY product_name
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topProductsPresentQuery = `
        SELECT product_name, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE())
        GROUP BY product_name
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topProductsAllQuery = `
        SELECT product_name, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        GROUP BY product_name
        ORDER BY total_qty DESC
        LIMIT 12;
    `;

    // แสดงหมวดหมู่สินค้าหลักยอดนิยม 12 รายการ (ก่อนหน้า - ปัจจุบัน - ทุกปี)
    const topCatMainProductsOldQuery = `
        SELECT cat_name_main, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE()) - 1
        GROUP BY cat_name_main
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topCatMainProductsPresentQuery = `
        SELECT cat_name_main, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE())
        GROUP BY cat_name_main
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topCatMainProductsAllQuery = `
        SELECT cat_name_main, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        GROUP BY cat_name_main
        ORDER BY total_qty DESC
        LIMIT 12;
    `;

    // แสดงหมวดหมู่สินค้าย่อยยอดนิยม 12 รายการ (ก่อนหน้า - ปัจจุบัน - ทุกปี)
    const topCatSubProductsOldQuery = `
        SELECT cat_name_sub, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE()) - 1
        GROUP BY cat_name_sub
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topCatSubProductsPresentQuery = `
        SELECT cat_name_sub, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        WHERE YEAR(time_order) = YEAR(CURDATE())
        GROUP BY cat_name_sub
        ORDER BY total_qty DESC
        LIMIT 12;
    `;
    const topCatSubProductsAllQuery = `
        SELECT cat_name_sub, SUM(cart_product_qty) AS total_qty
        FROM Order_Product_Lists
        GROUP BY cat_name_sub
        ORDER BY total_qty DESC
        LIMIT 12;
    `;

    // รูปแบบชำระเงินยอดนิยม
    const paymentMethodsQuery = `
        SELECT p.pay_cat_name AS payment_method, COUNT(o.pay_id) AS count
        FROM Orders o
        JOIN Payment_Options p ON o.pay_id = p.pay_id
        GROUP BY p.pay_cat_name;
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
                                
                                    db.query(dashQuery8, (err, dashQuery8Results) => {
                                        if (err) throw err;
        
                                        db.query(monthlySalesOldQuery, (err, monthlySalesOldResults) => {
                                            if (err) throw err;

                                            db.query(monthlySalesPresentQuery, (err, monthlySalesPresentResults) => {
                                                if (err) throw err;

                                                db.query(monthlySalesAllQuery, (err, monthlySalesAllResults) => {
                                                    if (err) throw err;

                                                    db.query(topProductsOldQuery, (err, topProductsOldQueryResults) => {
                                                        if (err) throw err;

                                                        db.query(topProductsPresentQuery, (err, topProductsPresentResults) => {
                                                            if (err) throw err;
                                                        
                                                            db.query(topProductsAllQuery, (err, topProductsAllResults) => {
                                                                if (err) throw err;
                                                            
                                                                db.query(topCatMainProductsOldQuery, (err, topCatMainProductsOldResults) => {
                                                                    if (err) throw err;

                                                                    db.query(topCatMainProductsPresentQuery, (err, topCatMainProductsPresentResults) => {
                                                                        if (err) throw err;

                                                                        db.query(topCatMainProductsAllQuery, (err, topCatMainProductsAllResults) => {
                                                                            if (err) throw err;
                                                                    
                                                                            db.query(topCatSubProductsOldQuery, (err, topCatSubProductsOldResults) => {
                                                                                if (err) throw err;

                                                                                db.query(topCatSubProductsPresentQuery, (err, topCatSubProductsPresentResults) => {
                                                                                    if (err) throw err;

                                                                                    db.query(topCatSubProductsAllQuery, (err, topCatSubProductsAllResults) => {
                                                                                        if (err) throw err;
                                    
                                                                                        db.query(paymentMethodsQuery, (err, paymentMethodsResults) => {
                                                                                            if (err) throw err;
                                                                                        
                                                                                            // ข้อมูลสรุปพื้นฐาน
                                                                                            const dashQuery0Re = dashQuery0Results[0].total_shop_owner;
                                                                                            const dashQuery1Re = dashQuery1Results[0].total_employees;
                                                                                            const dashQuery2Re = dashQuery2Results[0].total_customers;
                                                                                            const dashQuery3Re = dashQuery3Results[0].total_payments;
                                                                                            const dashQuery4Re = dashQuery4Results[0].total_net_amount;
                                                                                            const dashQuery5Re = dashQuery5Results[0].total_orders;
                                                                                            const dashQuery6Re = dashQuery6Results[0].total_products;
                                                                                            const dashQuery7Re = dashQuery7Results[0].total_categories_main;
                                                                                            const dashQuery8Re = dashQuery8Results[0].total_categories_sub;
                                                    
                                                                                            // ข้อมูลยอดขายแต่ละเดือน (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                            const monthlyOldLabels = monthlySalesOldResults.map(row => row.month_name);
                                                                                            const monthlyOldData = monthlySalesOldResults.map(row => row.total_sales);
                                                                                            const monthlyPresentLabels = monthlySalesPresentResults.map(row => row.month_name);
                                                                                            const monthlyPresentData = monthlySalesPresentResults.map(row => row.total_sales);
                                                                                            const monthlyAllLabels = monthlySalesAllResults.map(row => row.month_name);
                                                                                            const monthlyAllData = monthlySalesAllResults.map(row => row.total_sales);
                                                                                            
                                                                                            // ข้อมูลสินค้ายอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                            const topProductsOldQueryLabels = topProductsOldQueryResults.map(row => row.product_name);
                                                                                            const topProductsOldQueryData = topProductsOldQueryResults.map(row => row.total_qty);
                                                                                            const topProductPresentLabels = topProductsPresentResults.map(row => row.product_name);
                                                                                            const topProductPresentData = topProductsPresentResults.map(row => row.total_qty);
                                                                                            const topProductAllLabels = topProductsAllResults.map(row => row.product_name);
                                                                                            const topProductAllData = topProductsAllResults.map(row => row.total_qty);
                                                                                            
                                                                                            // ข้อมูลหมวดหมู่สินค้าหลักยอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                            const topCatMainProductsOldLabels = topCatMainProductsOldResults.map(row => row.cat_name_main);
                                                                                            const topCatMainProductsOldData = topCatMainProductsOldResults.map(row => row.total_qty);
                                                                                            const topCatMainProductsPresentLabels = topCatMainProductsPresentResults.map(row => row.cat_name_main);
                                                                                            const topCatMainProductsPresentData = topCatMainProductsPresentResults.map(row => row.total_qty);
                                                                                            const topCatMainProductsAllLabels = topCatMainProductsAllResults.map(row => row.cat_name_main);
                                                                                            const topCatMainProductsAllData = topCatMainProductsAllResults.map(row => row.total_qty);
                                                                                            
                                                                                            // ข้อมูลหมวดหมู่สินค้าย่อยยอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                            const topCatSubProductsOldLabels = topCatSubProductsOldResults.map(row => row.cat_name_sub);
                                                                                            const topCatSubProductsOldData = topCatSubProductsOldResults.map(row => row.total_qty);
                                                                                            const topCatSubProductsPresentLabels = topCatSubProductsPresentResults.map(row => row.cat_name_sub);
                                                                                            const topCatSubProductsPresentData = topCatSubProductsPresentResults.map(row => row.total_qty);
                                                                                            const topCatSubProductsAllLabels = topCatSubProductsAllResults.map(row => row.cat_name_sub);
                                                                                            const topCatSubProductsAllData = topCatSubProductsAllResults.map(row => row.total_qty);
                                                                                            
                                                                                            // ข้อมูลรูปแบบชำระเงินยอดนิยม
                                                                                            const paymentLabels = paymentMethodsResults.map(row => row.payment_method);
                                                                                            const paymentData = paymentMethodsResults.map(row => row.count);
                                                    
                                                                                            res.render('Role/Shop_Owner/Dashbord', { 
                                                                                                title, 
                                                                                                your_page,
                                                                                                error: error[0],
                                                                                                success: success[0],
                                                                                                // ข้อมูลสรุปพื้นฐาน
                                                                                                dashQuery0Re,
                                                                                                dashQuery1Re,
                                                                                                dashQuery2Re,
                                                                                                dashQuery3Re,
                                                                                                dashQuery4Re,
                                                                                                dashQuery5Re,
                                                                                                dashQuery6Re,
                                                                                                dashQuery7Re,
                                                                                                dashQuery8Re,
                                                                                                // ข้อมูลยอดขายแต่ละเดือน (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                                monthlyOldLabels: JSON.stringify(monthlyOldLabels),
                                                                                                monthlyOldData: JSON.stringify(monthlyOldData),
                                                                                                monthlyPresentLabels: JSON.stringify(monthlyPresentLabels),
                                                                                                monthlyPresentData: JSON.stringify(monthlyPresentData),
                                                                                                monthlyAllLabels: JSON.stringify(monthlyAllLabels),
                                                                                                monthlyAllData: JSON.stringify(monthlyAllData),
                                                                                                // ข้อมูลสินค้ายอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                                topProductsOldQueryLabels: JSON.stringify(topProductsOldQueryLabels),
                                                                                                topProductsOldQueryData: JSON.stringify(topProductsOldQueryData),
                                                                                                topProductPresentLabels: JSON.stringify(topProductPresentLabels),
                                                                                                topProductPresentData: JSON.stringify(topProductPresentData),
                                                                                                topProductAllLabels: JSON.stringify(topProductAllLabels),
                                                                                                topProductAllData: JSON.stringify(topProductAllData),
                                                                                                // ข้อมูลหมวดหมู่สินค้าหลักยอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                                topCatMainProductsOldLabels: JSON.stringify(topCatMainProductsOldLabels),
                                                                                                topCatMainProductsOldData: JSON.stringify(topCatMainProductsOldData),
                                                                                                topCatMainProductsPresentLabels: JSON.stringify(topCatMainProductsPresentLabels),
                                                                                                topCatMainProductsPresentData: JSON.stringify(topCatMainProductsPresentData),
                                                                                                topCatMainProductsAllLabels: JSON.stringify(topCatMainProductsAllLabels),
                                                                                                topCatMainProductsAllData: JSON.stringify(topCatMainProductsAllData),
                                                                                                // ข้อมูลหมวดหมู่สินค้าย่อยยอดนิยม (ก่อนหน้า - ปัจจุบัน - ทุกปี)
                                                                                                topCatSubProductsOldLabels: JSON.stringify(topCatSubProductsOldLabels),
                                                                                                topCatSubProductsOldData: JSON.stringify(topCatSubProductsOldData),
                                                                                                topCatSubProductsPresentLabels: JSON.stringify(topCatSubProductsPresentLabels),
                                                                                                topCatSubProductsPresentData: JSON.stringify(topCatSubProductsPresentData),
                                                                                                topCatSubProductsAllLabels: JSON.stringify(topCatSubProductsAllLabels),
                                                                                                topCatSubProductsAllData: JSON.stringify(topCatSubProductsAllData),
                                                                                                // ข้อมูลรูปแบบชำระเงินยอดนิยม
                                                                                                paymentLabels: JSON.stringify(paymentLabels),
                                                                                                paymentData: JSON.stringify(paymentData)
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
