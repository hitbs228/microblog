var create_users_table = new Migration({
	up: function() {
		this.change_table('content',function(t){
			t.change('user','text',{not_null: true});
		});
	},
	down: function() {
		this.drop_table('content');
	}
});