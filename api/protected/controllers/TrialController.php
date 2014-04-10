<?php

class TrialController extends Controller
{
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
		$trial = new Trial();
		$criteria=new CDbCriteria;
		if($this->getRole() == 2) {
			$criteria->select='*';
		}

		$count = $trial->count($criteria);

		$criteria->limit = $pagenum;
		$criteria->offset = ($page - 1 ) * $pagenum;
		$criteria->order = 'datetime DESC';
		$trials = $trial->findAll($criteria);

		$retdata = array();
		foreach($trials as $trial) {
			$data = $trial->attributes;
			$retdata[] = $data;
		}

		$this->responseJSON($retdata, $count);
	}

	public function actionPost() {
		$request = Yii::app()->getRequest();
		$name = $request->getPost('name');
		$address = $request->getPost('address');
		$tel = $request->getPost('tel');
		$trial = new Trial();
		$trial->name = $name;
		$trial->address = $address;
		$trial->tel = $tel;
		$trial->datetime = time();
		$trial->save();
		if($trial->validate()) {
			$trial->save();
			echo '1';
		}
		else {
			echo '-1';
		}
	}

}