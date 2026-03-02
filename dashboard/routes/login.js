/**
 * ——————————————————————————————————————————————————————
 * PROJECT: NEZUKO CHAN BOT DASHBOARD LOGIN
 * AUTHOR: TAWHID AHMED (TawHid_Bbz)
 * DESCRIPTION: Secure authentication for Nezuko Project
 * ——————————————————————————————————————————————————————
 */

const expres = require("express");
const router = expres.Router();

module.exports = function ({ unAuthenticated, isVerifyRecaptcha, Passport }) {
	router
		.get("/", unAuthenticated, (req, res) => {
			req.session.redirectTo = req.query.redirect || "/";
			res.render("login", { title: "Nezuko Login | Authorized Access Only" });
		})
		.post("/", unAuthenticated, async (req, res, next) => {
			// Replacing Vietnamese "Captcha không hợp lệ" with English branding
			if (!await isVerifyRecaptcha(req.body["g-recaptcha-response"]))
				return res.status(400).send({
					status: "error",
					errors: [{ msg: "Invalid Captcha. Please prove you're not a robot to Nezuko." }]
				});

			Passport.authenticate("local", function (err, user, info) {
				if (err)
					return next(err);

				if (!user) {
					return res.status(400).send({
						status: "error",
						errors: [{ msg: info.message }]
					});
				}
				const redirectLink = req.session.redirectTo || "/";

				req.login(user, function (err) {
					if (err)
						return next(err);

					res.send({
						status: "success",
						message: "Welcome back to Nezuko Dashboard!",
						redirectLink
					});
				});
			})(req, res, next);
		});

	return router;
};
