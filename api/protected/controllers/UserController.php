<?php

class UserController extends Controller
{
	protected $request = NULL;

	public function init() {
		parent::init();
		$this->request = Yii::app()->getRequest();
	}

	public function actionIndex()
	{
		$this->render('index');
	}

	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/


	/**
	 * Sina Callback
	 */
	public function actionSinacallback() {
    set_time_limit(0);
		$o = new SaeTOAuthV2(WB_AKEY, WB_SKEY);
		if ($code = $this->request->getQuery('code')) {
			$keys = array();
			$keys['code'] = $code;
			$keys['redirect_uri'] = WB_CALLBACK_URL;
			try {
				if(Yii::app()->session["weibo_access_token"]) {
					$access_token = Yii::app()->session["weibo_access_token"];
					$sns_id = Yii::app()->session['user']['sns_uid'];
				}
				else {
					$token = $o->getAccessToken('code', $keys);
					$access_token = $token["access_token"];
					$sns_id = $token["uid"];
				}
				$c = new SaeTClientV2(WB_AKEY, WB_SKEY, $access_token);
				$basic_account = $c->show_user_by_id($sns_id);
				if ($user = $this->getUser($basic_account['id'])) {
					$this->refreshSnsUser($user['uid'], $access_token, $basic_account);
					Yii::app()->session['is_login'] = "true";
					Yii::app()->session['user'] = $user;
				} else {
					if ($user = $this->regUser($access_token, $basic_account)) {
						Yii::app()->session["is_login"] = "true";
						Yii::app()->session["user"] = $user;
						$this->responseJSON($user,'success');
					}
				}
				echo "Success! Please close this window";
			} catch(oAuthException $e) {
				echo 'error';
			}
		} else {
			echo 'error';
		}
	}

	public function getUser($sns_uid) {
		$user = Yii::app()->db->createCommand()
			->select("*")
			->from("User")
			->where('sns_uid = :sns_uid', array(":sns_uid" => $sns_uid))
			->queryRow();
		if (!empty($user)) {
			return $user;
		}
		return FALSE;
	}

	protected function regUser($access_token, $basic_account = array()) {
		$newUser = array(
			'sns_uid' => $basic_account["idstr"],
			'username' => $basic_account["screen_name"],
			'screen_name' => $basic_account["screen_name"],
			'avatar' => $basic_account["avatar_large"],
			'location' => $basic_account["location"],
			'gender' => $basic_account["gender"],
			'access_token' => $access_token,
			'reg_datetime' => time()
		);
		$mUser = new User();
		foreach ($newUser as $property => $value) {
			$mUser->{$property} = $value;
		}
		if ($mUser->insert()) {
			$newUser["uid"] = $mUser->getPrimaryKey();
			return $newUser;
		}
		return FALSE;
	}

	/**
	 * 更新sns用户信息
	 */
	protected function refreshSnsUser($uid, $access_token, $basic_account = array()) {
		$data = array(
			'uid' => (int)$uid,
			'username' => $basic_account['screen_name'],
			'avatar' => $basic_account['avatar_large'],
			'access_token' => $access_token
		);

		$mUser = new User();
		$mUser->setIsNewRecord(false);
		foreach ($data as $property => $value) {
			$mUser->{$property} = $value;
		}
		$mUser->update();
	}


}