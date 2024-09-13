exports.getMakeaTradingTransactionPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'MAKE A TRADING TRANSACTION - ' + settings.text_footer;
    const your_page = 'Make_a_Trading_Transaction';
    const error = req.flash('error');
    const success = req.flash('success');
    const user = res.locals.user;

    if (!user || !user.member_id) {
        console.error('User not authenticated or user ID not found');
        return res.redirect('/');
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
            p.product_id,
            p.product_name,
            p.product_price,
            p.product_unit_number,
            Categories.cat_id,
            Categories.cat_name_main,
            Categories.cat_name_sub,
            Cart_Orders.cart_product_qty,
            Cart_Orders.time_order
        FROM 
            Cart_Orders
        INNER JOIN 
            Users ON Cart_Orders.cashier_id = Users.member_id
        INNER JOIN 
            Products p ON Cart_Orders.product_id = p.product_id
        INNER JOIN 
            Categories ON p.cat_id = Categories.cat_id
        WHERE 
            Cart_Orders.cashier_id = ?
        ORDER BY 
            Cart_Orders.time_order DESC
    `;

    db.query(dataQuery, [cashierId], (err, cartResult) => {
        if (err) {
            console.error(err);
            req.flash('error', 'เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้าสินค้า');
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        db.query(dataQueryPay, (err, paymentOptions) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการดึงข้อมูลตัวเลือกการชำระเงิน');
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }

            // Calculate totals
            const totalAmount = cartResult.reduce((acc, cart) => acc + (cart.product_price * cart.cart_product_qty), 0);
            let memberDisRate;
            if (settings.customer_discount === "Other") {
                memberDisRate = settings.customer_discount_custom / 100;
            } else {
                memberDisRate = settings.customer_discount / 100;
            }
            const memberDis = totalAmount * memberDisRate;
            const netTotal = totalAmount - memberDis;

            res.render('Role/Cashier/Make_a_Trading_Transaction', { 
                title, 
                your_page, 
                error: error[0],
                success: success[0],
                carts: cartResult,
                paymentOptions,
                totalAmount,
                memberDis,
                netTotal,
                cashierFirstName: cartResult[0]?.member_firstname || '',
                cashierLastName: cartResult[0]?.member_lastname || ''
            });
        });
    });
};

exports.postAddProductCart = (req, res) => {
    const { cashier_id, product_id } = req.body;

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
            req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบสินค้า');
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        // Check if the product exists
        const productExists = result[0].count > 0;

        if (!productExists) {
            req.flash('error', 'ไม่พบรหัสสินค้ารายการนี้ หรือไม่มีรายการสินค้านี้ในฐานข้อมูล');
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        // Query to check if the product is already in the cart
        const checkCartQuery = 'SELECT * FROM Cart_Orders WHERE cashier_id = ? AND product_id = ?';

        db.query(checkCartQuery, [cashier_id, product_id], (err, result) => {
            if (err) {
                console.error(err);
                req.flash('error', 'เกิดข้อผิดพลาดในการตรวจสอบสินค้าในตะกร้า');
                return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
            }

            if (result.length > 0) {
                // Product is already in the cart, increment the quantity by 1
                const newQuantity = result[0].cart_product_qty + 1;
                const updateQuery = 'UPDATE Cart_Orders SET cart_product_qty = ? WHERE cashier_id = ? AND product_id = ?';

                db.query(updateQuery, [newQuantity, cashier_id, product_id], (err, result) => {
                    if (err) {
                        console.error(err);
                        req.flash('error', 'เกิดข้อผิดพลาดในการอัพเดทปริมาณสินค้าในตะกร้า');
                        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                    }
                    req.flash('success', 'อัพเดทปริมาณสินค้าในตะกร้าเรียบร้อย');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                });
            } else {
                // Product is not in the cart, insert a new entry with quantity 1
                const insertQuery = 'INSERT INTO Cart_Orders (cart_id, cashier_id, product_id, cart_product_qty) VALUES (?, ?, ?, ?)';

                db.query(insertQuery, [cart_id, cashier_id, product_id, 1], (err, result) => {
                    if (err) {
                        console.error(err);
                        req.flash('error', 'เกิดข้อผิดพลาดในการเพิ่มสินค้าใหม่ในตะกร้า');
                        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                    }
                    req.flash('success', 'เพิ่มสินค้าใหม่ในตะกร้าเรียบร้อย');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                });
            }
        });
    });
};

exports.updateProductQuantity = (req, res) => {
    const { cart_id, cart_product_qty } = req.body;

    // คำสั่ง SQL เพื่ออัปเดตปริมาณสินค้าของตะกร้า
    const updateQuery = `
        UPDATE Cart_Orders 
        SET cart_product_qty = ? 
        WHERE cart_id = ?
    `;

    db.query(updateQuery, [cart_product_qty, cart_id], (err, result) => {
        if (err) {
            console.error('ข้อผิดพลาดในการอัปเดตปริมาณสินค้า:', err);
            req.flash('error', 'ข้อผิดพลาดในการอัปเดตปริมาณสินค้า');
            return res.status(500).json({ success: false, message: 'ไม่สามารถอัปเดตปริมาณได้' });
        }

        if (cart_product_qty < 1) {
            req.flash('error', 'จำนวนสินค้าจะต้องมีอย่างน้อย x1 หน่วย');
        } else if (cart_product_qty > 99) {
            req.flash('error', 'จำนวนสินค้าจะต้องไม่เกิน x99 หน่วย');
        } else {
            req.flash('success', 'อัปเดตปริมาณสินค้าสำเร็จ');
        }

        // ส่งคำตอบความสำเร็จ
        res.json({ success: true, message: 'อัปเดตปริมาณสินค้าสำเร็จ' });
    });
};

exports.getDeleteProductCartPage = (req, res) => {
    const cart_id = req.params.cart_id;
    const query = 'DELETE FROM Cart_Orders WHERE cart_id = ?';

    db.query(query, [cart_id], (err, result) => {
        if (err) {
            console.error('ข้อผิดพลาดในการลบสินค้าจากตะกร้า:', err);
            req.flash('error', 'ไม่สามารถลบสินค้าจากตะกร้าได้');
        } else {
            req.flash('success', 'ลบสินค้าจากตะกร้าสำเร็จ');
        }
        res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
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
        'product_price[]': productPrices,
        'cat_name_main[]': catNameMains,
        'cat_name_sub[]': catNameSubs
    } = req.body;

    // สร้าง Order ID
    const generateOrderId = () => {
        return 'OD' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    const order_id = generateOrderId();

    // ค่าปริยาย
    const finalCustomerId = customer_id || "N/A";
    const finalGetMoney = get_money || 0.00;
    const finalChangeMoney = change_money || 0.00;

    let finalMemberDiscount = member_discount;
    let finalNetTotal = net_total;
    
    if (finalCustomerId === "N/A") {
        finalMemberDiscount = 0.00;
        finalNetTotal = total_amount - finalMemberDiscount;
    }    

    // กำหนดวันและเวลาในการสั่งซื้อ
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

    // แปลง Arrays จากข้อมูลฟอร์มหากเป็นสตริง
    const parseArray = (data) => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') return data.split(',').map(item => item.trim());
        return [];
    };

    let productNamesArray = parseArray(productNames);
    let cartProductQtysArray = parseArray(cartProductQtys).map(Number);
    let productPricesArray = parseArray(productPrices).map(Number);
    let catNameMainsArray = parseArray(catNameMains);
    let catNameSubsArray = parseArray(catNameSubs);

    // ตรวจสอบการไม่ตรงกันของความยาว
    if (productNamesArray.length !== cartProductQtysArray.length || productNamesArray.length !== productPricesArray.length) {
        console.error('ความยาวของรายละเอียดสินค้าไม่ตรงกัน');
        req.flash('error', 'ความยาวของรายละเอียดสินค้าผิดพลาด');
        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
    }

    // แทรก Order
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
            console.error('ข้อผิดพลาดในการเพิ่มคำสั่งซื้อ:', err);
            req.flash('error', 'ไม่สามารถสร้างคำสั่งซื้อได้');
            return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
        }

        // แทรก Order_Product_Lists
        if (productNamesArray.length > 0) {
            const productListQuery = `
                INSERT INTO Order_Product_Lists (order_id, product_name, cart_product_qty, product_price, cat_name_main, cat_name_sub) 
                VALUES ?
            `;
            
            const productListValues = productNamesArray.map((name, index) => [
                order_id,
                name,
                cartProductQtysArray[index],
                productPricesArray[index],
                catNameMainsArray[index],
                catNameSubsArray[index]
            ]);
            
            db.query(productListQuery, [productListValues], (err) => {
                if (err) {
                    console.error('ข้อผิดพลาดในการเพิ่มผลิตภัณฑ์:', err);
                    req.flash('error', 'ไม่สามารถเพิ่มผลิตภัณฑ์ในคำสั่งซื้อได้');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }

                // ลบจาก Cart_Orders
                const deleteCartQuery = `DELETE FROM Cart_Orders WHERE cashier_id = ?`;
                
                db.query(deleteCartQuery, [cashier_id], (err) => {
                    if (err) {
                        console.error('ข้อผิดพลาดในการลบตะกร้า:', err);
                        req.flash('error', 'ไม่สามารถล้างตะกร้าได้');
                        return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                    }

                    // เปลี่ยนเส้นทางไปยังหน้าการชำระเงิน
                    req.flash('success', 'ทำรายการคำสั่งซื้อสำเร็จ');
                    res.redirect('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/' + order_id);
                });
            });
        } else {
            // ลบจาก Cart_Orders
            const deleteCartQuery = `DELETE FROM Cart_Orders WHERE cashier_id = ?`;
            
            db.query(deleteCartQuery, [cashier_id], (err) => {
                if (err) {
                    console.error('ข้อผิดพลาดในการลบตะกร้า:', err);
                    req.flash('error', 'ไม่สามารถล้างตะกร้าได้');
                    return res.redirect('/Role/Cashier/Page/Make_a_Trading_Transaction');
                }

                // เปลี่ยนเส้นทางไปยังหน้าการชำระเงิน
                req.flash('success', 'สร้างรายการออเดอร์สำเร็จ');
                res.redirect('/Role/Cashier/Page/Make_a_Payment_Transaction/Order/' + order_id);
            });
        }
    });
};