<?php

class TrialController extends Controller
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
		$address = $request->getPost('address');
		$tel = $request->getPost('tel');
		$trial = new Trial();
		$trial->name = $name;
		$trial->address = $address;
		$trial->tel = $tel;
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