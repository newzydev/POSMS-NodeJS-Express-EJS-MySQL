exports.getMakeaTradingTransactionPage = (req, res) => {
    const title = 'Make a Trading Transaction | Point Of Sale Management System';
    const your_page = 'Make_a_Trading_Transaction';
    const user = res.locals.user;

    if (!user || !user.member_id) {
        console.error('User not authenticated or user ID not found');
        return res.redirect('/Login');
    }

    const cashierId = user.member_id;

    const dataQueryPay = `
        SELECT 
            pay_id,
            pay_cat_name,
            pay_bank_name,
            pay_status
        FROM 
            Payment_Options
        ORDER BY 
            time_order ASC
    `;

    const dataQuery = `
        SELECT 
            Cart_Orders.cart_id,
            Cart_Orders.cashier_id,
            Users.member_firstname,
            Users.member_lastname,
            Products.product_id,
            Products.product_name,
            Products.product_price,
            Cart_Orders.cart_product_qty,
            Cart_Orders.time_order
        FROM 
            Cart_Orders
        INNER JOIN 
            Users ON Cart_Orders.cashier_id = Users.member_id
        INNER JOIN 
            Products ON Cart_Orders.product_id = Products.product_id
        WHERE 
            Cart_Orders.cashier_id = ?
        ORDER BY 
            Cart_Orders.time_order DESC
    `;

    db.query(dataQuery, [cashierId], (err, cartResult) => {
        if (err) {
            console.error(err);
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        db.query(dataQueryPay, (err, paymentOptions) => {
            if (err) {
                console.error(err);
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }

            // Calculate totals
            const cashier = cartResult[0] || {};
            const totalAmount = cartResult.reduce((acc, cart) => acc + (cart.product_price * cart.cart_product_qty), 0);
            const memberDisRate = 0.01; // 1% Discount
            const memberDis = totalAmount * memberDisRate;
            const netTotal = totalAmount - memberDis;

            res.render('Role/Cashier/Make_a_Trading_Transaction', { 
                title, 
                your_page, 
                carts: cartResult,
                paymentOptions,
                totalAmount,
                memberDis,
                netTotal,
                cashierFirstName: cashier.member_firstname,
                cashierLastName: cashier.member_lastname
            });
        });
    });
};

exports.postAddProductCart = (req, res) => {
    const { cashier_id, product_id, cart_product_qty } = req.body;

    // Function to generate a unique cart ID
    const generateCartId = () => {
        return 'CA' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const cart_id = generateCartId();

    // Query to check if the product exists
    const checkProductQuery = 'SELECT COUNT(*) AS count FROM Products WHERE product_id = ?';

    db.query(checkProductQuery, [product_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        // Check if the product exists
        const productExists = result[0].count > 0;

        if (!productExists) {
            // Product does not exist, fetch existing carts data to display
            const title = 'Make a Trading Transaction | Point Of Sale Management System';
            const your_page = 'Make_a_Trading_Transaction';
            const user = res.locals.user;

            if (!user || !user.member_id) {
                console.error('User not authenticated or user ID not found');
                return res.redirect('/Login');
            }

            const cashierId = user.member_id;
            
            const dataQueryPay = `
                SELECT 
                    pay_id,
                    pay_cat_name,
                    pay_bank_name,
                    pay_bank_number,
                    pay_status
                FROM 
                    Payment_Options
                ORDER BY 
                    time_order ASC
            `;

            const dataQuery = `
                SELECT 
                    Cart_Orders.cart_id,
                    Cart_Orders.cashier_id,
                    Users.member_firstname,
                    Users.member_lastname,
                    Products.product_id,
                    Products.product_name,
                    Products.product_price,
                    Cart_Orders.cart_product_qty,
                    Cart_Orders.time_order
                FROM 
                    Cart_Orders
                INNER JOIN 
                    Users ON Cart_Orders.cashier_id = Users.member_id
                INNER JOIN 
                    Products ON Cart_Orders.product_id = Products.product_id
                WHERE Cart_Orders.cashier_id = ?
                ORDER BY 
                    Cart_Orders.time_order DESC
            `;

            db.query(dataQuery, [cashierId], (err, cartResult) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }
        
                db.query(dataQueryPay, (err, paymentOptions) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                    }
        
                    // Calculate totals
                    const cashier = cartResult[0] || {};
                    const totalAmount = cartResult.reduce((acc, cart) => acc + (cart.product_price * cart.cart_product_qty), 0);
                    const memberDisRate = 0.01; // 1% Discount
                    const memberDis = totalAmount * memberDisRate;
                    const netTotal = totalAmount - memberDis;
        
                    res.render('Role/Cashier/Make_a_Trading_Transaction', { 
                        title, 
                        your_page, 
                        carts: cartResult,
                        paymentOptions,
                        totalAmount,
                        memberDis,
                        netTotal,
                        cashierFirstName: cashier.member_firstname,
                        cashierLastName: cashier.member_lastname
                    });
                });
            });
            return;
        }

        // Proceed to add the product to the cart
        const query = 'INSERT INTO Cart_Orders (cart_id, cashier_id, product_id, cart_product_qty) VALUES (?, ?, ?, ?)';
        
        db.query(query, [cart_id, cashier_id, product_id, cart_product_qty], (err, result) => {
            if (err) {
                console.error(err);
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }
            res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        });
    });
};

exports.updateProductQuantity = (req, res) => {
    const { cart_id, cart_product_qty } = req.body;

    // Query to update the cart product quantity
    const updateQuery = `
        UPDATE Cart_Orders 
        SET cart_product_qty = ? 
        WHERE cart_id = ?
    `;

    db.query(updateQuery, [cart_product_qty, cart_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to update quantity' });
        }

        // Return success response
        res.json({ success: true });
    });
};

exports.getDeleteProductCartPage = (req, res) => {
    const cart_id = req.params.cart_id;
    const query = 'DELETE FROM Cart_Orders WHERE cart_id = ?';
    
    db.query(query, [cart_id], (err, result) => {
        if (err) {
            res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        } else {
            res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }
    });
};

exports.postAddOrder = (req, res) => {
    const {
        cashier_id,
        customer_id,
        pay_id,
        total_unit,
        total_amount,
        member_discount,
        net_total,
        get_money,
        change_money,
        'product_name[]': productNames,
        'cart_product_qty[]': cartProductQtys,
        'product_price[]': productPrices
    } = req.body;

    // Generate Order ID
    const generateOrderId = () => {
        return 'OD' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    const order_id = generateOrderId();

    // Default values
    const finalCustomerId = customer_id || "N/A";
    const finalGetMoney = get_money || 0.00;
    const finalChangeMoney = change_money || 0.00;

    let finalMemberDiscount = member_discount;
    let finalNetTotal = net_total;
    
    if (finalCustomerId === "N/A") {
        finalMemberDiscount = 0.00;
        finalNetTotal = total_amount - finalMemberDiscount;
    }    

    // Set Date and Time Order
    const now = new Date();
    const options_date = {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const options_time = {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDate = now.toLocaleDateString('th-TH', options_date);
    const formattedTime = now.toLocaleTimeString('th-TH', options_time);
    const order_time_transaction = formattedDate + ' ' + formattedTime;
    const order_time_payment = "N/A";

    // Parse Arrays from Form Data if they are strings
    const parseArray = (data) => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') return data.split(',').map(item => item.trim());
        return [];
    };

    let productNamesArray = parseArray(productNames);
    let cartProductQtysArray = parseArray(cartProductQtys).map(Number);
    let productPricesArray = parseArray(productPrices).map(Number);

    // Check for length mismatch
    if (productNamesArray.length !== cartProductQtysArray.length || productNamesArray.length !== productPricesArray.length) {
        console.error('Mismatch in product details length');
        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
    }

    // Insert Order
    const insertOrderQuery = `
        INSERT INTO Orders (order_id, cashier_id, customer_id, pay_id, total_unit, total_amount, member_discount, net_total, get_money, change_money, order_time_transaction, order_time_payment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(insertOrderQuery, [
        order_id, cashier_id, finalCustomerId, pay_id,
        total_unit, total_amount, finalMemberDiscount, finalNetTotal, finalGetMoney,
        finalChangeMoney, order_time_transaction, order_time_payment
    ], (err, result) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        // Insert Order_Product_Lists
        if (productNamesArray.length > 0) {
            const productListQuery = `
                INSERT INTO Order_Product_Lists (order_id, product_name, cart_product_qty, product_price) 
                VALUES ?
            `;
            
            const productListValues = productNamesArray.map((name, index) => [
                order_id,
                name,
                cartProductQtysArray[index],
                productPricesArray[index]
            ]);
            
            db.query(productListQuery, [productListValues], (err) => {
                if (err) {
                    console.error('Error inserting products:', err);
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }

                // Delete from Cart_Orders
                const deleteCartQuery = `DELETE FROM Cart_Orders WHERE cashier_id = ?`;
                
                db.query(deleteCartQuery, [cashier_id], (err) => {
                    if (err) {
                        console.error('Error deleting cart:', err);
                        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                    }

                    // Redirect to the payment transaction page
                    res.redirect('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/' + order_id);
                });
            });
        } else {
            // Delete from Cart_Orders
            const deleteCartQuery = `DELETE FROM Cart_Orders WHERE cashier_id = ?`;
            
            db.query(deleteCartQuery, [cashier_id], (err) => {
                if (err) {
                    console.error('Error deleting cart:', err);
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }

                // Redirect to the payment transaction page
                res.redirect('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/' + order_id);
            });
        }
    });
};
