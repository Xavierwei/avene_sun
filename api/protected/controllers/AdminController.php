<?php

class AdminController extends Controller
{
	public $defaultAction = 'index';
	public $request;
  public $layout = 'admin';

	public function getRole() {
		return Yii::app()->session['user_role'];
	}

	public function init() {
		parent::init();
		$this->request = Yii::app()->getRequest();
	}

  public function actionIndex(){
    $this->layout = 'admin';
    if(Yii::app()->user->getIsGuest()) {
      $this->render('login');
    }
    else {
      $this->render('index');
    }
  }

  public function returnJSON($data) {
      header("Content-Type: application/json");
      echo CJSON::encode($data);
      Yii::app()->end();
  }

  public function error($msg, $code) {
      return array(
          "data" => NULL,
          "error" => array(
              "code" => $code,
              "message" => $msg,
          ),
      );
  }

  public function actionLogin() {
    $username = $this->request->getPost("username");
    $password = $this->request->getPost("password");
    $userIdentify = new UserIdentity($username, $password);

    // 验证没有通过
    if (!$userIdentify->authenticate()) {
      $this->redirect(Yii::app()->request->baseUrl.'/index.php/admin/index');
    }
    else {
      Yii::app()->user->login($userIdentify);
			$user = User::model()->findByPk(Yii::app()->user->getId());
			Yii::app()->session['user_role'] = $user->role;
			$this->redirect(Yii::app()->request->baseUrl.'/index.php/admin/index');
    }
  }

  public function actionIsAdmin() {
    if(Yii::app()->user->getIsGuest())
    {
      return $this->returnJSON(array(
        "data" => 0,
        "error" => NULL
      ));
    }
    else {
      return $this->returnJSON(array(
        "data" => 1,
        "error" => NULL
      ));
    }
  }


	/**
	 * 退出
	 */
	public function actionLogout() {
		Yii::app()->user->logout();
		return $this->returnJSON(array(
			"data" => "logout success",
			"error" => NULL
		));
	}

	public function actionAdminStatus(){
		if($this->getRole() != 2) {
			return;
		}
		$adminUid = Yii::app()->params['adminWeiboUid'];
		$adminUser = User::model()->findByAttributes(array('sns_uid'=>$adminUid));
		$access_token = $adminUser->access_token;
		$c = new SaeTClientV2(WB_AKEY, WB_SKEY, $access_token);
		$contents = $c->public_timeline();
		if(isset($contents['error_code'])){
			$o = new SaeTOAuthV2( WB_AKEY , WB_SKEY );
			$weiboUrl = $o->getAuthorizeURL(WB_CALLBACK_URL);
			$this->responseJSON($weiboUrl, 'success');
		}
		else {
			$this->responseJSON(1, 'success');
		}
	}

  public function actionAdminFetchStatus(){
    if($this->getRole() != 2) {
      return;
    }
    $adminUid = Yii::app()->params['adminWeiboUid'];
    $adminUser = User::model()->findByAttributes(array('sns_uid'=>$adminUid));
    $access_token = $adminUser->access_token;
    $c = new SaeTClientV2(WB_AKEY, WB_SKEY, $access_token);
    $contents = $c->public_timeline();
    if(isset($contents['error_code'])){
      $o = new SaeTOAuthV2( WB_AKEY , WB_SKEY );
      $weiboUrl = $o->getAuthorizeURL(WB_CALLBACK_URL);
      $this->render('weibologin',array('weiboUrl'=>$weiboUrl));
    }
    else {
    }
  }
}