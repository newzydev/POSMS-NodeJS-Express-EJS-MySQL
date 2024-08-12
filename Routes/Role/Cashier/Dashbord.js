exports.getCashierDashbordPage = (req, res) => {
    const title = 'Dashbord | Point Of Sale Management System';
    const your_page = 'Dashbord';

    const orderCountQuery = "SELECT COUNT(*) AS total_orders FROM Orders;";
    const employeeCountQuery = "SELECT COUNT(*) AS total_employees FROM Users WHERE role_id IN ('ROLE001', 'ROLE002');";
    const customerCountQuery = "SELECT COUNT(*) AS total_customers FROM Users WHERE role_id = 'ROLE003';";
    const productCountQuery = "SELECT COUNT(*) AS total_products FROM Products;";
    
    db.query(orderCountQuery, (err, orderResults) => {
        if (err) {
            throw err;
        }

        db.query(employeeCountQuery, (err, employeeResults) => {
            if (err) {
                throw err;
            }

            db.query(customerCountQuery, (err, customerResults) => {
                if (err) {
                    throw err;
                }

                db.query(productCountQuery, (err, productResults) => {
                    if (err) {
                        throw err;
                    }
    
                    const totalOrders = orderResults[0].total_orders;
                    const totalEmployees = employeeResults[0].total_employees;
                    const totalCustomers = customerResults[0].total_customers;
                    const totalProducts = productResults[0].total_products;
    
                    res.render('Role/Cashier/Dashbord', { 
                        title, 
                        your_page, 
                        totalOrders,
                        totalEmployees,
                        totalCustomers,
                        totalProducts
                    });
                });
            });

        });

    });
};