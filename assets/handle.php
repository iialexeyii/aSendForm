<?php
/* 
	Created by Art Sites Studio
	Site: art-sites.org
	Version: 1.4
*/
define ("bitrixLogin", "");
define ("bitrixPass", "");
define ("bitrixDomen", "");


if (isset($_POST['art_mail_to'])) {
	
	if (sendMail(bitrix_send())) {
		echo "Вашая заявка принята.<br> Мы свяжемся с Вами в ближайшее время";
	}else{
		echo "Сообщение не отправлено<br> Пожалуйста, попробуйте ещё раз";
	}			
}else{
	echo 'Не указан адрес для отправки';
}

function rus2translit($text){
    // Русский алфавит
    $rus_alphabet = array(
        'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й',
        'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф',
        'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
        'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й',
        'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф',
        'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я',' ','#','\'','-'
    );
    
    // Английская транслитерация
    $rus_alphabet_translit = array(
        'A', 'B', 'V', 'G', 'D', 'E', 'IO', 'ZH', 'Z', 'I', 'I',
        'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F',
        'H', 'C', 'CH', 'SH', 'SH', '`', 'Y', '`', 'E', 'IU', 'IA',
        'a', 'b', 'v', 'g', 'd', 'e', 'io', 'zh', 'z', 'i', 'i',
        'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f',
        'h', 'c', 'ch', 'sh', 'sh', '`', 'y', '`', 'e', 'iu', 'ia','_',' ',' ',' '
    );
    
    return str_replace($rus_alphabet, $rus_alphabet_translit, $text);
}

function bitrix_send(){
	if ($_POST['art_bitrix']){
		$art_bitrix = $_POST['art_bitrix'];
		$data = '';
		foreach ($art_bitrix as $key => $val) {
			if ($val[1]) 
			$data .= $val[0].'='.$val[1].'&';
		}
		$request = 'LOGIN='.bitrixLogin.'&PASSWORD='.bitrixPass.'&'.$data;
		return get_web_page('https://'.bitrixDomen.'/crm/configs/import/lead.php',"POST",$request);
	}else{
		return true;
	}
}



function sendMail($header)
{
	if ($_POST['art_bitrix']){
		$header = str_replace('\'', '"', $header['content']);
		$header = json_decode($header);
	}

	$to  = $_POST['art_mail_to'];
	// тема письма
	$subject = 'Запрос '.$_POST['art_post_pagetitle'];
	// текст письма
	foreach ($_POST as $key => $val) {
		if ($key != 'art_post_pagetitle' && $key != 'art_mail_to' && $key != 'art_bitrix') 
			if ($val[1]) 
				$mail_content .= '<tr><td align="right">'.$val[0].'</td><td>:</td><td>'.$val[1].'</td></tr>';
	}
	if ($_POST['art_bitrix'])
		$mail_content .='Ответ от битрикс24 - '.$header->{'error_message'};
	$message = '
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title data-form="subject">'.$subject.'</title>

</head>
<body class="email-template" bgcolor="#e4e7e9" style="margin: 0;padding: 0;font-size: 100%;line-height: 1.6;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: none;width: 100%;height: 100%;"><table class="bg" style="margin:0;padding:0;border-collapse:collapse;"><tr><td class="bg-gray" width="2560" height="100%" bgcolor="#e4e7e9" align="center"><table class="body-wrap" align="center" style="margin: 0;border-collapse: collapse;width: 100%;margin-top: 3%;padding: 0 10%;"><tr><td></td><td class="main-container" bgcolor="#FFFFFF" align="center" style="margin:0 auto;padding:20px 40px 20px 40px;display:block;max-width:600px;clear:both;width:80%;-webkit-border-top-left-radius: 3px;-webkit-border-top-right-radius: 3px;-moz-border-radius-topleft: 3px;-moz-border-radius-topright: 3px;border-top-left-radius: 3px;border-top-right-radius: 3px;-webkit-box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.1);-moz-box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.1);"><table width="100%"><tr><td align="center"><table><tr><td width="10%"></td><td width="80%" align="center" valign="middle">
<h2 style="font-size: 25px;">


      <!-- 2. Amend Thank You title -->
      '.$subject.'
      <!-- Step 2 Complete -->        


</h1></td><td width="10%"></td></tr><tr><td colspan="3" width="100%" height="10"></td></tr><tr><td colspan="3" width="100%" align="center" valign="middle"><h3>


      <table style="width: 500px;">
      	<tbody>
      		'.$mail_content.'
      	</tbody>
      </table>


</h3></td></tr><tr><td colspan="3" width="100%" height="20"></td></tr></table></td></tr></table></td><td></td></tr></table><table class="brand-wrap" align="center" style="margin: 0;padding: 0;border-collapse: collapse;width: 100%;margin-top: 0%;"><tr><td></td><td class="brand-container"><div class="content" style="margin: 0 auto;padding: 0;max-width: 600px;display: block;"><table width="100%" style="margin: 0;padding: 0;border-collapse: collapse;width: 100%;"><tr><td><table style="margin: 0;padding: 0;border-collapse: collapse;width: 100%;"><tr><td class="brand" align="center" valign="middle" style="height: 100px;"><a href="http://art-sites.org/" style="text-decoration:none;border:0;"><img class="template-img" width="120px" 
src="http://images.art-sites.org/mail/blogo.png" alt="Powered By Receiptful" style="margin: 0;padding: 0;max-width: 100%;" border="0" /></a></td></tr></table></td></tr></table></div></td><td></td></tr></table></td></tr></table>
</body>
</html>
	';
	// Для отправки HTML-письма должен быть установлен заголовок Content-type
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	// Дополнительные заголовки
	$headers .= 'To:  <'.$to.'>' . "\r\n";
	$headers .= 'From: '.rus2translit($_POST['art_post_pagetitle']).' '. "\r\n";
	// Отправляем
	return mail($to, $subject, $message, $headers);
}

function get_web_page($url,$method = "GET",$data = ''){
        $user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';
        if ($method == "GET") 
        	$POST = false;
        else
        	$POST = true;
        
        $options = array(
            CURLOPT_CUSTOMREQUEST  => $method,        //set request type post or get
            CURLOPT_POST           => $POST,        //set to GET
            CURLOPT_POSTFIELDS     => $data,
            CURLOPT_USERAGENT      => $user_agent, //set user agent
            CURLOPT_RETURNTRANSFER => true,     // return web page
            CURLOPT_HEADER         => false,    // don't return headers
            CURLOPT_FOLLOWLOCATION => true,     // follow redirects
            CURLOPT_ENCODING       => "",       // handle all encodings
            CURLOPT_AUTOREFERER    => true,     // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
            CURLOPT_TIMEOUT        => 120,      // timeout on response
            CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
        );

        $ch      = curl_init( $url );
        curl_setopt_array( $ch, $options );
        $content = curl_exec( $ch );
        $err     = curl_errno( $ch );
        $errmsg  = curl_error( $ch );
        $header  = curl_getinfo( $ch );
        curl_close( $ch );

        $header['errno']   = $err;
        $header['errmsg']  = $errmsg;
        $header['content'] = $content;
        return $header;
    }