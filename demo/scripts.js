$(function(){
	var asoc = {
		'name' : 'Имя',
		'phone' : 'Номер телефона',
		'email' : 'Е-mail',
		'wyn': 'Чего хочет клиент'
	};

	var vRules = {
			rules: {
				name: {
					required: true
				},
				email: {
					required: false,
					email: true
				},
				phone: {
					required: true,
					regex: /^((8|\+\d{1,3})[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g
				}
			},

			messages: {
				name: {
					required: "Это поле обязательное для заполнения",
					email: "Введите данные в указаном формате"
				},
				email: {
					email: "Введите данные в указаном формате"
				},
				phone:{
					required: "Это поле обязательное для заполнения",
					regex : 'Номер нужно указывать в международном формате<br><span>+1 234 567 89 01</span>'
				}
			},
		};


	$("#test").aSendForm({
			//popup : '.btnp-kp , .popup-kp',
			goal : function(){
				// ga('send', 'event', 'knopka', 'zakazat');
				// yaCounter26593851.reachGoal('send');
			},
			postQuery: '/aSendForm/assets/handle.php',
			closeData: 113000,
			associations : asoc,
			mailTo : 'alexmilliarder@gmail.com',
			//answer: true,
			validateRuls: vRules,
			// onClickPopup: function(){
				
			// },
	});
})