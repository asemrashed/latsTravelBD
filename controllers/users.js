const User= require('../model/user')

module.exports.renderRegister= (req, res) => {
    res.render('users/register');
}

module.exports.registered= async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${registeredUser.username}`);
            res.redirect('/spots');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
}

module.exports.authenticate = (req, res) => {
    const username=req.session.passport.user
    req.flash('success', `Welcome back | ${username} |` );
    const redirectUrl = req.session.returnTo || '/spots';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'See you soon!');
        res.redirect('/home');
    });
}