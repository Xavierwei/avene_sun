<?php

class GameController extends Controller
{
	private $_answer = array(
		'1_3', '2_1', '3_2'
	);

	public function getRole() {
		return Yii::app()->session['user_role'];
	}

	public function actionIndex()
	{
		$this->render('index');
	}

	public function actionPost() {
		$request = Yii::app()->getRequest();
		$name = $request->getPost('name');
		$email = $request->getPost('email');
		$tel = $request->getPost('tel');
		$game = new Game();
		$game->name = $name;
		$game->email = $email;
		$game->tel = $tel;
		$game->save();
		if($game->validate()) {
			$game->save();
			echo '1';
		}
		else {
			echo '-1';
		}
	}

	public function actionAnswer() {
		$request = Yii::app()->getRequest();
		$answer = $request->getPost('answer');
		if(in_array($answer, $this->_answer)) {
			echo '1';
		}
		else {
			echo '-1';
		}
	}
}