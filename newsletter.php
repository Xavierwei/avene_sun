<?php
$email = $_POST['email'];
if(empty($email))
{
    echo 10;
    return;
}
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://www.club-avene.cn/Subscribe.ashx?source=Avene+CS&key=DSiTDSiTEADSiTEST&email='.$email);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ;
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
echo $output = curl_exec($ch);