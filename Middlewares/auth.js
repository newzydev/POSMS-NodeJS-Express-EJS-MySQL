// Authentication Middlewares
const authenticateUser = (db) => (req, res, next) => {
    // Use signedCookies to access the signed cookie
    if (!req.signedCookies.MEMBER_TOKEN) {
        return res.redirect('/');
    }

    const dataQuery = `
        SELECT 
            Users.member_id, 
            Users.member_email, 
            Users.member_email_activate, 
            Users.member_firstname, 
            Users.member_lastname,
            Users.member_tel, 
            Users.member_time_register, 
            Users.member_time_login, 
            User_Role.role_id, 
            User_Role.role_name 
        FROM 
            Users 
        INNER JOIN 
            User_Role 
        ON 
            Users.role_id = User_Role.role_id 
        WHERE Users.member_id = ?
    `;
    
    db.query(dataQuery, [req.signedCookies.MEMBER_TOKEN], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            res.clearCookie('MEMBER_TOKEN');
            res.clearCookie('ROLE_TOKEN');
            return res.redirect('/');
        }

        res.locals.user = results[0];
        next();
    });
};

// Authorization Middlewares
const checkRole = (roleId) => (req, res, next) => {
    const user = res.locals.user;
    if (user && user.role_id === roleId) {
        return next();
    } else {
        return res.status(403).render('Error_Page/403', { title: 'Forbidden Access Denied | Point Of Sale Management System' });
    }
};

const checkRole001 = checkRole('ROLE001');
const checkRole002 = checkRole('ROLE002');
const checkRole003 = checkRole('ROLE003');

module.exports = {
    authenticateUser,
    checkRole001,
    checkRole002,
    checkRole003
};
