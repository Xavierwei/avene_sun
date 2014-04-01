<?php

class GameController extends Controller
{
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
			echo 1;
		}
		else {
			echo 0;
		}
	}

	public function actionAnswer() {
		
	}
}