var config = require('./config')
  , orm = require('orm')
  , crypto = require('crypto');

exports.index = function(req, res){
	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var user_content = db.define('content',{
			user:String,
			content:String
		});
		user_content.find(8,["id","Z"],function(err,users){
			res.render('index',{
				title: '首页',
				success:req.flash('success'),
				login_user:req.session.user,
				error:req.flash('error'),
				users:users
			});
		});
	});
};

exports.user = function(req, res) {
	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var user_content = db.define('content',{
			user:String,
			content:String
		});

		user_content.find({user:req.session.user.name},function(err,user){
			res.render('user',{
				title:req.session.user.name,
				login_user:req.session.user,
				user:user,
				menu_css:'menu_user.js',
				success:req.flash('success')
			});
		});
	});
};

exports.post = function(req, res) {
	if(!req.body.content){
		req.flash('error','发表内容为空，请输入内容！');
		return res.redirect('/');
	}

	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var user_content = db.define('content',{
			user:String,
			content:String
		});
		user_content.create([{
			user:req.session.user.name,
			content:req.body.content
		}],function(err,user){
			console.log(user);
			req.flash('success','发表成功！');
			res.redirect('/');
			db.sync();
		});
	});
};

exports.reg = function(req, res) {
	res.render('reg_or_login',{
		login_user:req.session.user,
		error:req.flash('error'),
		title:'注册',
		route:'/reg',
		menu_css:'menu_reg.js'
	});
};

exports.doReg = function(req, res) {
	if(req.body.password_repeat != req.body.password){
		req.flash('error','两次口令不一致!');
		return res.redirect('/reg');
	}

	var name = req.body.username;
	var patrn_user = /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,19}$/;  //校验登录名：只能输入5-20个以字母开头、可带数字、“_”、的字串

	if(!patrn_user.exec(name)){
		req.flash('error',"用户名格式有误，请输入5-20个以字母开头、可带数字、'_'的字串");
		return res.redirect('/reg');
	}

	var patrn_key = /^(\w){6,20}$/;  //校验密码：只能输入6-20个字母、数字、下划线
	if(!patrn_key.exec(req.body.password)){
		req.flash('error','密码格式有误，请输入6-20个字母、数字、下划线');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var new_user = db.define('users',{
			name:String,
			password:String
		});
		new_user.find({name:name},function(err,user){
			if(user.length != 0){
				req.flash('error','用户已存在!');
				return res.redirect('/reg');
			}
			new_user.create([{
				name:name,
				password:password
			}],function(err,user){
				console.log(user[0]);
				req.session.user = user[0];
				req.flash('success','注册成功');
				res.redirect('/');
				db.sync();
			});
		});
	});
};

exports.login = function(req, res) {
	res.render('reg_or_login',{
		login_user:req.session.user,
		title:'登入',
		route:'/login',
		error:req.flash('error'),
		menu_css:'menu_login.js'
	});
};

exports.doLogin = function(req, res) {
	if(req.body.password_repeat != req.body.password){
		req.flash('error','两次口令不一致!');
		return res.redirect('/login');
	}

	var name = req.body.username;
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var users = db.define('users',{
			name:String,
			password:String
		});

		users.find({name:name},function(err,user){
			if(!user){
				req.flash('error','用户不存在！');
				return res.redirect('/login');
			}

			if(user[0].password!=password){
				req.flash('error','用户口令错误！');
				return res.redirect('/login');
			}
			req.session.user = user[0];
			req.flash('success','登入成功！');
			res.redirect('/');
		});
	});

};

exports.logout = function(req, res) {
	req.session.user=null;
	req.flash('success','登出成功！');
	res.redirect('/');
};

exports.edit = function(req, res){
	res.render('edit',{
		title:req.session.user.name,
		login_user:req.session.user,
		error:req.flash('error'),
		content:req.query.content
	});
};

exports.doEdit = function(req, res){
	if(!req.body.content){
		req.flash('error','发表内容为空，请输入内容！');
		return res.redirect('/edit/'+req.session.user.name);
	}

	orm.connect(config.opts,function(err, db){
		if(err) throw err;

		var user = db.define('content',{
			user:String,
			content:String
		});

		user.find({user:req.session.user.name},function(err, people){
			people[0].content = req.body.content;
			people[0].save(function(err){
				db.sync();
				req.flash('success','修改成功！');
				res.redirect('/u/' + req.session.user.name);
			});
		});
	});
};

exports.delete = function(req, res){
	orm.connect(config.opts,function(err,db){
		if(err) throw err;

		var user = db.define('content',{
			user:String,
			content:String
		});

		user.find({user:req.session.user.name,content:req.query.content},function(err, people){
			people[0].remove(function(err){
				db.sync();
				req.flash('success','删除成功！');
				res.redirect('/u/'+req.session.user.name);
			});
		});
	});
};