exports.getSystemSettingPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'SYSTEM SETTINGS - ' + settings.text_footer;
    const your_page = 'System_Settings';

    const settings_form_0_error = req.flash('settings_form_0_error');
    const settings_form_0_success = req.flash('settings_form_0_success');
    const settings_form_1_error = req.flash('settings_form_1_error');
    const settings_form_1_success = req.flash('settings_form_1_success');
    const settings_form_2_error = req.flash('settings_form_2_error');
    const settings_form_2_success = req.flash('settings_form_2_success');
    const settings_form_3_error = req.flash('settings_form_3_error');
    const settings_form_3_success = req.flash('settings_form_3_success');
    const settings_form_4_error = req.flash('settings_form_4_error');
    const settings_form_4_success = req.flash('settings_form_4_success');
    const settings_form_5_error = req.flash('settings_form_5_error');
    const settings_form_5_success = req.flash('settings_form_5_success');
    const settings_form_6_error = req.flash('settings_form_6_error');
    const settings_form_6_success = req.flash('settings_form_6_success');

    // Query to retrieve system settings from the database
    const query = 'SELECT * FROM Systen_Settings';

    db.query(query, (err, result) => {
        if (err) throw err;

        const settings = result[0];
        res.render('Role/Shop_Owner/System_Settings', { 
            title, 
            your_page,
            settings_form_0_error: settings_form_0_error[0],
            settings_form_0_success: settings_form_0_success[0],
            settings_form_1_error: settings_form_1_error[0],
            settings_form_1_success: settings_form_1_success[0],
            settings_form_2_error: settings_form_2_error[0],
            settings_form_2_success: settings_form_2_success[0],
            settings_form_3_error: settings_form_3_error[0],
            settings_form_3_success: settings_form_3_success[0],
            settings_form_4_error: settings_form_4_error[0],
            settings_form_4_success: settings_form_4_success[0],
            settings_form_5_error: settings_form_5_error[0],
            settings_form_5_success: settings_form_5_success[0],
            settings_form_6_error: settings_form_6_error[0],
            settings_form_6_success: settings_form_6_success[0],
            settings
        });
    });
};

exports.postUpdateSettingsForm0 = (req, res) => {
    const { login_time_out } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET login_time_out = ?`;

    db.query(query, [login_time_out], (err) => {
        if (err) {
            req.flash('settings_form_0_error', 'เกิดข้อผิดพลาดในการแก้ไขเวลาจดจำลงชื่อเข้าใช้');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขเวลาจดจำลงชื่อเข้าใช้ได้' });
        } 

        req.flash('settings_form_0_success', 'แก้ไขเวลาจดจำลงชื่อเข้าใช้สำเร็จ');
        res.json({ success: true, message: 'แก้ไขเวลาจดจำลงชื่อเข้าใช้สำเร็จ' });
    });
};

exports.postUpdateSettingsForm1 = (req, res) => {
    const { store_name, store_description, store_categorie, store_categorie_custom } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET store_name = ?, store_description = ?, store_categorie = ?, store_categorie_custom = ?`;

    db.query(query, [store_name, store_description, store_categorie, store_categorie_custom], (err) => {
        if (err) {
            req.flash('settings_form_1_error', 'เกิดข้อผิดพลาดในการแก้ไขการตั้งค่าส่วนข้อมูลร้านค้า');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขการตั้งค่าส่วนข้อมูลร้านค้าได้' });
        } 

        req.flash('settings_form_1_success', 'แก้ไขการตั้งค่าส่วนข้อมูลร้านค้าสำเร็จ');
        res.json({ success: true, message: 'แก้ไขการตั้งค่าส่วนข้อมูลร้านค้าสำเร็จ' });
    });
};

exports.postUpdateSettingsForm2 = (req, res) => {
    const { 
        day_open_1, time_open_1, time_close_1,
        day_open_2, time_open_2, time_close_2,
        day_open_3, time_open_3, time_close_3,
        day_open_4, time_open_4, time_close_4,
        day_open_5, time_open_5, time_close_5,
        day_open_6, time_open_6, time_close_6,
        day_open_7, time_open_7, time_close_7
    } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET day_open_1 = ?, time_open_1 = ?, time_close_1 = ?,
        day_open_2 = ?, time_open_2 = ?, time_close_2 = ?,
        day_open_3 = ?, time_open_3 = ?, time_close_3 = ?,
        day_open_4 = ?, time_open_4 = ?, time_close_4 = ?,
        day_open_5 = ?, time_open_5 = ?, time_close_5 = ?,
        day_open_6 = ?, time_open_6 = ?, time_close_6 = ?,
        day_open_7 = ?, time_open_7 = ?, time_close_7 = ?
    `;

    db.query(query, [day_open_1, time_open_1, time_close_1, day_open_2, time_open_2, time_close_2, day_open_3, time_open_3, time_close_3, day_open_4, time_open_4, time_close_4, day_open_5, time_open_5, time_close_5, day_open_6, time_open_6, time_close_6, day_open_7, time_open_7, time_close_7], (err) => {
        if (err) {
            req.flash('settings_form_2_error', 'เกิดข้อผิดพลาดในการแก้ไขการตั้งค่าเวลาทำการของร้านค้า');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขการตั้งค่าเวลาทำการของร้านค้าได้' });
        }

        req.flash('settings_form_2_success', 'แก้ไขการตั้งค่าเวลาทำการของร้านค้าสำเร็จ');
        res.json({ success: true, message: 'แก้ไขการตั้งค่าเวลาทำการของร้านค้าสำเร็จ' });
    });
};

exports.postUpdateSettingsForm3 = (req, res) => {
    const { map_iframe_api } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET map_iframe_api = ?`;

    db.query(query, [map_iframe_api], (err) => {
        if (err) {
            req.flash('settings_form_3_error', 'เกิดข้อผิดพลาดในการแก้ไขแผนที่ร้านค้า');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขแผนที่ร้านค้าได้' });
        } 

        req.flash('settings_form_3_success', 'แก้ไขแผนที่ร้านค้าสำเร็จ');
        res.json({ success: true, message: 'แก้ไขแผนที่ร้านค้าสำเร็จ' });
    });
};

exports.postUpdateSettingsForm4 = (req, res) => {
    const { customer_discount, customer_discount_custom } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET customer_discount = ?, customer_discount_custom = ?`;

    db.query(query, [customer_discount, customer_discount_custom], (err) => {
        if (err) {
            req.flash('settings_form_4_error', 'เกิดข้อผิดพลาดในการแก้ไขส่วนลดลูกค้าสมาชิก');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขส่วนลดลูกค้าสมาชิกได้' });
        } 

        req.flash('settings_form_4_success', 'แก้ไขส่วนลดลูกค้าสมาชิกสำเร็จ');
        res.json({ success: true, message: 'แก้ไขส่วนลดลูกค้าสมาชิกสำเร็จ' });
    });
};

exports.postUpdateSettingsForm5 = (req, res) => {
    const { privacy_policy, terms_and_conditions, cookie } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET privacy_policy = ?, terms_and_conditions = ?, cookie = ?`;

    db.query(query, [privacy_policy, terms_and_conditions, cookie], (err) => {
        if (err) {
            req.flash('settings_form_5_error', 'เกิดข้อผิดพลาดในการแก้ไข นโยบายความเป็นส่วนตัว หรือ ข้อกำหนดและเงื่อนไข หรือ นโยบายการใช้คุกกี้ ');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไข นโยบายความเป็นส่วนตัว หรือ ข้อกำหนดและเงื่อนไข หรือ นโยบายการใช้คุกกี้ ได้' });
        } 

        req.flash('settings_form_5_success', 'แก้ไข นโยบายความเป็นส่วนตัว หรือ ข้อกำหนดและเงื่อนไข หรือ นโยบายการใช้คุกกี้ สำเร็จ');
        res.json({ success: true, message: 'แก้ไข นโยบายความเป็นส่วนตัว หรือ ข้อกำหนดและเงื่อนไข หรือ นโยบายการใช้คุกกี้ สำเร็จ' });
    });
};

exports.postUpdateSettingsForm6 = (req, res) => {
    const { text_footer, system_version } = req.body;

    const query = `
        UPDATE Systen_Settings
        SET text_footer = ?, system_version = ?`;

    db.query(query, [text_footer, system_version], (err) => {
        if (err) {
            req.flash('settings_form_6_error', 'เกิดข้อผิดพลาดในการแก้ไขส่วนท้ายของเว็บไซต์');
            return res.status(500).json({ success: false, message: 'ไม่สามารถแก้ไขส่วนท้ายของเว็บไซต์ได้' });
        } 

        req.flash('settings_form_6_success', 'แก้ไขส่วนท้ายของเว็บไซต์สำเร็จ');
        res.json({ success: true, message: 'แก้ไขส่วนท้ายของเว็บไซต์สำเร็จ' });
    });
};