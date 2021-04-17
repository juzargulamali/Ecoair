require("dotenv").config();
const UserModel = require("../models/user");



const signedIn = (req) => req.session.userId;

exports.ensureSignedIn = (req, res, next) => {
  if (!signedIn(req)) {
		res.status(401).json("You must be signed in.");
		return;
  }
	next();
}

exports.isSignedIn = (req, res, next) => {
  if (!signedIn(req)) {
		res.status(200).json(false);
		return;
  }else {
		res.status(200).json(true);
	}
}


exports.signUp = async (req, res, next) => {
	const user = await UserModel.create(req.body);
	req.session.userId = user.id;
	res.status(201).json({user: user});
}

exports.signIn = async (req, res, next) => {
	const {username, password} = req.body;
	if(signedIn(req)){
		res.status(406).json("Already Signed In");
		return;
	}
	const user = await UserModel.findOne({ username: username });
	if (!user) {
		res.status(400).json("Please enter a correct username.");
		return;
	}
	if (!(await user.matchPassword(password))) {
		res.status(400).json("Please enter a correct password.");
		return;
	}
	req.session.userId = user.id;
	res.status(200).json({msg: "Signed In", user: user});
}


exports.signOut = async (req, res) => {
		if(!signedIn(req)) {
			res.status(406).json("Already Signed Out");
			return;
		}
    req.session.destroy((err) => {
      if (err) {
				res.status(500).json(err);
				return;
			}
      res.clearCookie(process.env.SESSION_NAME);
			res.status(200).json("Signed Out");
		}
	);
}



