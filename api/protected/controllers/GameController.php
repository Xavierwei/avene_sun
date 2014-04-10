<?php

class GameController extends Controller
{
	private $_answer = array(
		'1_3', '2_2', '3_2'
	);

	public function getRole() {
		return Yii::app()->session['user_role'];
	}

	public function actionIndex()
	{
	}

	public function actionList()
	{
		$request = Yii::app()->getRequest();
		$page = $request->getParam("page");
		if (!$page) {
			$page = 1;
		}
		$pagenum = $request->getParam("pagenum");
		if (!$pagenum) {
			$pagenum = 10;
		}
		$game = new Game();
		$criteria=new CDbCriteria;
		if($this->getRole() == 2) {
			$criteria->select='*';
		}

		$count = $game->count($criteria);

		$criteria->limit = $pagenum;
		$criteria->offset = ($page - 1 ) * $pagenum;
		$criteria->order = 'datetime DESC';
		$games = $game->findAll($criteria);

		$retdata = array();
		foreach($games as $game) {
			$data = $game->attributes;
			$retdata[] = $data;
		}

		$this->responseJSON($retdata, $count);
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
		$game->datetime = time();
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