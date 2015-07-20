/* 
	Created by Art Sites Studio
	Site: art-sites.org
	Version: 2.0
	More bitrix inputs https://dev.1c-bitrix.ru/community/blogs/chaos/crm-sozdanie-lidov-iz-drugikh-servisov.php
*/
(function( $ ) {




	$.fn.aSendForm = function(params){
		$(this).each(function(){
			var s = $.extend({
				answer : false, 				// Ответ от сервера, если не указать он будет стандартным, или можно указать jq object
				popup : false, 					// Является ли форма всплывающим окном, если да то нужно указать два параметра через кому в виде селекторов jquery ".кнопка , .селектор_блокаформы",
				popupEvent : false, 			// Тригер для вызова окна $(document).trigger('popupEvent');
				popupObj : {}, 					// Объект который передаётся в плагин bPopup
				onClickPopup : false, 			// Функция которая срабатывает во время нажатия кнопки всплывающего окна
				onClickForm : false, 			// Функция которая срабатывает во время нажатия отправки формы
				goal : false, 					// Цели, для аналитики
				postQuery: '/handle.php', 		// Путь к файлу handle.php
				closeData: 1000, 				// Время закрытия окна с ответом
				dataClass: 'amassage_popup', 	// Класс окна с ответом
				associations : null, 			// Объект который ассоциируется с атрибутом name="" в полей формы Например {'name':'Имя', 'phone':'Номер телефона'}
				mailTo : false, 				// Обязательный параметр, E-mail для отправки формы
				onSend : false, 				// Событие которое срабатывает во время отправки данных
				moreData : false,				// дополнительный параметр для дополнительных данных формы
				bitrix : { 						// Параметры для полей битрикса, обязательно нужно заполнить доступа к битриксу в файле handle.php
					'TITLE' : false
				},
				validateRuls: false,			// Правила и сообщения для валидации
				phoneValid: false

			}, params);
			var thisForm = $(this);
			if (typeof s.popupObj.onClose == 'function') {
				var tmpFun = s.popupObj.onClose;
				s.popupObj.onClose = function(){
					tmpFun();
					if (typeof $.aCallBack == 'function') {setTimeout(function(){$.aCallBack('tada')},30000);};
				}
			}else{
				s.popupObj.onClose = function(){
					if (typeof $.aCallBack == 'function') {setTimeout(function(){$.aCallBack('tada')},30000);};
				}
			}
				if (!s.mailTo) { $.error( 'Нужно ввести Ваш E-mail');};
				if (s.popup) {
					if (typeof $.fn.bPopup == 'function') {
						if (typeof s.popup[1] != 'undefined') {
								$(s.popup[1]).bind('click',function(){

								if (typeof s.onClickPopup == 'function') {s.onClickPopup.apply(this)};
								$(s.popup[0]).bPopup(s.popupObj);
								return false;
							})
						};
						if (s.popupEvent) {
							$(document).on(s.popupEvent, function(e, eventInfo) { 
							  $(s.popup[0]).bPopup(s.popupObj);
							});
						};
					}else{
						s.popup = false;
						console.warn('Plugin bPopup is not defined, popups is not work');
					}
				};








			/*
				Validation realisation
			*/

				function merge_options(obj1,obj2){
				    var obj3 = {};
				    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
				    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
				    return obj3;
				}
				var phoneVal = false;
				if (s.phoneValid) {
					if (typeof $.fn.mask == 'function') {
						thisForm.find("[name="+s.phoneValid[0]+"]").mask("+00", {placeholder:'+1'});
						thisForm.find("[name="+s.phoneValid[1]+"]").mask("000", {placeholder:'123'});
						thisForm.find("[name="+s.phoneValid[2]+"]").mask("0000000", {placeholder:'1234567'});
						if (s.phoneValid[3]) {
							phoneVal = {};
							phoneVal.rules = {};
							phoneVal.messages = {};
							phoneVal.rules[s.phoneValid[0]] = {required: true,minlength: 2}
							phoneVal.rules[s.phoneValid[1]] = {required: true,minlength: 3}
							phoneVal.rules[s.phoneValid[2]] = {required: true,minlength: 7}
							phoneVal.messages[s.phoneValid[0]] = {required: " ",minlength:" "}
							phoneVal.messages[s.phoneValid[1]] = {required: " ",minlength:" "}
							phoneVal.messages[s.phoneValid[2]] = {required: " ",minlength:" "};
						};
					}else{
						console.warn('Function nask is not defined, nask is not work');
					}
				};
				if (s.validateRuls) {
					if (typeof $.fn.validate == 'function') {
						var validateOption = {
							errorElement: 'div', //default input error message container
							errorPlacement: function(error,element){
								$(element).css('box-shadow','0 0 5px #ED2328');
								$(element).css('border-color','#ED2328');
								if ($(error[0]).text() != " ") {
									$(element).after($(error).addClass("a-valid-message")
										.css('margin-top',14 - $(element).css('marginBottom').replace(/px/g,"") +'px')
										.css('width', $(element).next('.a-valid-message'+' > p').outerWidth()+'px')
										.css('margin-left', ($(element).outerWidth()/100)*70  + parseFloat($(element).css('marginLeft')) +'px')
										.css("display","none")
										.fadeIn("fast",function(){
											setTimeout(function(){$(element).next('.a-valid-message').fadeOut(60)},2000);
										}));
									if ($(element).css('float') != 'none') {
										$(element).next('.a-valid-message').css('margin-top',14 + parseFloat($(element).height()) +'px')
									};
									$(element).focus(function(){
										$(element).next('.a-valid-message').fadeIn("fast");	
									});
									$(element).focusout(function(){
										$(element).next('.a-valid-message').fadeOut(50);
									});
								};
							},

							success: function (label) {
								label.prev('input').css({
									'box-shadow':'',
									'border-color':''
								});
								label.remove();
							},
						};

						$.validator.addMethod(
					        "regex",
					        function(value, element, regexp) {
					            var re = new RegExp(regexp);
					            return this.optional(element) || re.test(value);
					        },
					        "Please check your input."
						);
						if (s.phoneValid[3]) {
							s.validateRuls.rules = merge_options(phoneVal.rules, s.validateRuls.rules);
							s.validateRuls.messages = merge_options(phoneVal.messages, s.validateRuls.messages);
						};
						thisForm.validate(merge_options(validateOption, s.validateRuls));

						thisForm.find('input').keypress(function (e) {
							if (e.which == 13) {
								if (thisForm.validate().form()) {
									thisForm.submit();
								}
								return false;
							}
						});
					}else{
						console.warn('Function validate is not defined, validation is not work');
					}
					
				};

			/*
				Validation realisation
			*/





			/*
				Event of form send
			*/

				thisForm.bind('submit',function(){
						if (typeof $.fn.validate == 'function') {
							if (!thisForm.validate().form()) {
								return false;
							};
						};
					var input = {};

					var serializeForm = $(this).serializeArray();
					for (var i = 0; i < serializeForm.length; i++) {
						if(s.associations[serializeForm[i].name]){
							input[serializeForm[i].name] = [s.associations[serializeForm[i].name],serializeForm[i].value];
						}else{
							input[serializeForm[i].name] = [serializeForm[i].name,serializeForm[i].value];
						}
					};
					if (s.phoneValid) {

						if(s.associations["phone"]){
							input["phone"] = [s.associations["phone"], input[s.phoneValid[0]][1]+input[s.phoneValid[1]][1]+input[s.phoneValid[2]][1]];
						}else{
							input["phone"] = ["phone", input[s.phoneValid[0]][1]+input[s.phoneValid[1]][1]+input[s.phoneValid[2]][1]];
						}

						delete input[s.phoneValid[0]];
						delete input[s.phoneValid[1]];
						delete input[s.phoneValid[2]];
					};

					if (s.onClickForm) {
						var onClickFormResult = s.onClickForm.apply(this);
						if (onClickFormResult) {
							for (var i = 0; i < onClickFormResult.length; i++) {
								input['artsDataD'+i] = [onClickFormResult[i].title,onClickFormResult[i].data];
							};
						};
					};

					$(this).find('input, textarea').each(function(){
						if ($(this).attr('type') != 'submit') {
							$(this).val('');
						};
					});

					if (typeof s.goal == 'function') {s.goal()};

					input.art_post_pagetitle = document.title;
					input.art_mail_to = s.mailTo;
					if (s.bitrix['TITLE']) {
						input.art_bitrix = [];
						for(var name in s.bitrix){
							if (input[s.bitrix[name]]) {
								input.art_bitrix.push([name , input[s.bitrix[name]][1]]);
							}else{
								input.art_bitrix.push([name , s.bitrix[name]]);
							}
						}
						
					};

					if (s.moreData) {
						for (var i = 0; i < s.moreData.length; i++) {
							input['artsDataF'+i] = [s.moreData[i].title,s.moreData[i].data];
						};
					};
					$.post(s.postQuery,input).done(function(e){
						if (s.popup) {
							$(s.popup[0]).bPopup().close();
						};
						if (typeof s.onSend == 'function') {s.onSend()};
						if (s.answer) {e = s.answer};
						if (typeof s.answer != 'object') {
							var styleDiv = s.dataClass == 'amassage_popup' ? 'style = \'background: #fff;padding: 28px 44px;width: 550px;max-width: 100%;display:none;transform: translateX(-50%);\'' : '';
							var styleH2 = s.dataClass == 'amassage_popup' ? 'style = \'margin: 5px;text-align: center;font-weight: 200;font-size: 27px;\'' : '';
							$('body').append('<div class="'+s.dataClass+'" '+ styleDiv +'><h2 '+styleH2+' >'+e+'</h2></div>');
							$('.'+s.dataClass).bPopup({
								autoClose: s.closeData,
								onClose: function(){
									$('.'+s.dataClass).remove();

								},
								follow: [false, true],
	            				position: ['50%', 'auto'],
							});
						}else{
							s.answer.bPopup({
								autoClose: s.closeData,
								onClose: function(){
									$('.'+s.dataClass).remove();

								},
							});
						}
						
					})
					return false;
				})

			/*
				Event of form send
			*/
		});

		}
})(jQuery)