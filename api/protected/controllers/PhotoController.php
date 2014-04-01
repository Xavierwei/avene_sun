<?php

class PhotoController extends Controller
{

	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	public function init() {
		Yii::import("application.vendor.*");
	}

	public function getRole() {
		return Yii::app()->session['user_role'];
	}

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','view','list','fetch','post','ChangeStatus','GetStatistics','Search','getcounts','GetProxyData','FetchProxyData'),
				'users'=>array('*'),
			),
			array('allow', // allow authenticated user to perform 'create' and 'update' actions
				'actions'=>array('create','update'),
				'users'=>array('@'),
			),
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('admin','delete'),
				'users'=>array('admin'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
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
		$status = $request->getParam("status");
		if (!isset($status)) {
			$status = 1;
		}
		$photo = new Photo();
		$criteria=new CDbCriteria;
		if($this->getRole() == 2) {
			$criteria->select='*';
		}
		else {
			$criteria->select='pid,weibo_id,url,sns_uid,image,content,datetime';
		}
		if($status != 'all' && $this->getRole() == 2) {
			$criteria->condition='status=:status';
			$criteria->params=array(':status'=>$status);
		}
    else {
      $criteria->condition='status=:status';
      $criteria->params=array(':status'=>1);
    }
		$criteria->limit = $pagenum;
		$criteria->offset = ($page - 1 ) * $pagenum;
		$criteria->order = 'datetime DESC';
		$photos = $photo->findAll($criteria);

		$retdata = array();
		foreach($photos as $photo) {
			$data = $photo->attributes;
			$data['link']= $data['sns_uid'].'/'.$data['url'];
			unset($data['avatar']);
			unset($data['sns_uid']);
			if($this->getRole() != 2) {
				unset($data['status']);
				unset($data['screen_name']);
			}
			unset($data['url']);

			$retdata[] = $data;
		}

		$this->responseJSON($retdata, "success");
	}

	public function actionPost() {
		if($this->isPost()){
			if(Yii::app()->session['is_login']) {
				$request = Yii::app()->getRequest();
				$photoUpload = CUploadedFile::getInstanceByName("photo");
				$description = $request->getPost('description');
				if ($photoUpload) {
					$mime = $photoUpload->getType();
					$allowMime = array(
						"image/gif", "image/png", "image/jpeg", "image/jpg"
					);
					if (!in_array($mime, $allowMime)) {
						return $this->responseError("photo's media type is not allowed");
					}
					else
					{
						$dir = ROOT_PATH."/upload/tmp/";
						if (!is_dir($dir)) {
							mkdir($dir, 0777, TRUE);
						}
						$filename = uniqid().'_'.time().'.'.$photoUpload->extensionName;
						$to = $dir."/". $filename;
						$ret = $photoUpload->saveAs($to);
						if($ret) {
							$c = new SaeTClientV2(WB_AKEY, WB_SKEY, Yii::app()->session['weibo_access_token']);
							//TODO: Change the image url
							$contents = $c->upload($description, 'http://ww4.sinaimg.cn/mw690/59209e01gw1ed6hevjpp9j20g60qo0vg.jpg');
							if(isset($contents['error_code'])){
								$this->responseError($contents);
							}
							unlink($to);
						}
					}
				}
				else {
					return $this->responseError("not get photo");
				}
			}
			else {
				return $this->responseError("not login");
			}
		}
		else {
			return $this->responseError("not post");
		}
	}


	public function actionWeiboPost() {
		if($this->isPost()){
				$request = Yii::app()->getRequest();

				$photo = new Photo();
				$photo->weibo_id =$request->getPost('weibo_id');
				$photo->url =$request->getPost('url');
				$photo->screen_name =$request->getPost('screen_name');
				$photo->gender =$request->getPost('gender');
				$photo->location =$request->getPost('location');
				$photo->sns_uid =$request->getPost('sns_uid');
				$photo->avatar =$request->getPost('avatar');
				$photo->content =$request->getPost('content');



				$photoUpload = CUploadedFile::getInstanceByName("image");
				if ($photoUpload) {
					$mime = $photoUpload->getType();
					$allowMime = array(
						"image/gif", "image/png", "image/jpeg", "image/jpg"
					);
					if (!in_array($mime, $allowMime)) {
						return $this->responseError("photo's media type is not allowed");
					}
					else
					{
						$photo->image = savePostImage($photoUpload, $photo->weibo_id);
						if($photo->validate()) {
							$photo->save();
							return $this->responseJSON($photo,'success');
						}
					}
				}
				else {
					return $this->responseError("not get photo");
				}
			}
			else {
				return $this->responseError("not login");
			}
	}


	public function actionChangeStatus() {
		if($this->getRole() != 2) {
			return;
		}
		$request = Yii::app()->getRequest();
		$pid = $request->getPost('pid');
		$status = $request->getPost('status');
		$photo = Photo::model()->findByPk($pid);
		$photo->status = $status;
		$photo->save();
		$this->responseJSON(1, "success");
	}


	public function actionFetch() {
		set_time_limit(0);
		$adminUid = Yii::app()->params['adminWeiboUid'];
		$adminUser = User::model()->findByAttributes(array('sns_uid'=>$adminUid));
		$access_token = $adminUser->access_token;
		$c = new SaeTClientV2(WB_AKEY, WB_SKEY, $access_token);
		$contents = $c->search_topics("#水漾美肌#");
		if(isset($contents['error_code'])){
			echo "The weibo access token is expired, please login again in back office.";
			return;
		}
		if(isset($contents['statuses'])) {
			Photo::model()->fetchContents($contents['statuses']);
			echo "Finished :)";
		}
		else {
			echo "Sina API is busy, please try later.";
		}
	}

  public function actionGetCounts()
  {
    $request = Yii::app()->getRequest();
    $id = $request->getParam('id');
    $adminUid = Yii::app()->params['adminWeiboUid'];
    $adminUser = User::model()->findByAttributes(array('sns_uid'=>$adminUid));
    $access_token = $adminUser->access_token;
    $c = new SaeTClientV2(WB_AKEY, WB_SKEY, $access_token);
    $counts = $c->show_counts($id);
    if(isset($counts['error_code'])){
      return $this->responseError("sina api error");
    }
    return $this->responseJSON($counts,'success');
  }

	public function actionGetStatistics()
	{
		if($this->getRole() != 2) {
			return;
		}
		$statistics = Photo::model()->getStatistics();
		return $this->responseJSON($statistics,'success');
	}

	public function actionSearch()
	{
		if($this->getRole() != 2) {
			return;
		}
		$request = Yii::app()->getRequest();
		$page = $request->getParam("page");
		if (!$page) {
			$page = 1;
		}
		$pagenum = $request->getParam("pagenum");
		if (!$pagenum) {
			$pagenum = 10;
		}
		$gender = $request->getParam("gender");
		$username = $request->getParam("username");
		$location = $request->getParam("location");

		$criteria = new CDbCriteria();
		$criteria->select = "*";
		if($username) {
			$criteria->addSearchCondition('screen_name', $username, TRUE);
		}
		if($location) {
			$criteria->addSearchCondition('location', $location, TRUE);
		}
		if($gender) {
			$criteria->addCondition('gender=:gender');
			$criteria->params[':gender'] = $gender;
		}
		$criteriaCount = clone $criteria;
		$criteria->limit = $pagenum;
		$criteria->offset = ($page - 1 ) * $pagenum;
		$criteria->order = 'datetime DESC';
		$photos = Photo::model()->findAll($criteria);
		$count = Photo::model()->count($criteriaCount);
		return $this->responseJSON($photos,$count);
	}


  public function actionGetProxyData() {
    $retdata = Photo::model()->getAllPhotos();
    $this->responseJSON($retdata, "success");
  }


  public function actionFetchProxyData() {
    $dataJson = file_get_contents(Yii::app()->params['proxyServer'].'/photo/GetProxyData');
    $data = json_decode($dataJson);
    $contents = $data->data;
    Photo::model()->fetchProxyContents($contents);
    echo "Finished :)";
  }



	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new Photo;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Photo']))
		{
			$model->attributes=$_POST['Photo'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->pid));
		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Photo']))
		{
			$model->attributes=$_POST['Photo'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->pid));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		$this->loadModel($id)->delete();

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		$dataProvider=new CActiveDataProvider('Photo');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new Photo('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Photo']))
			$model->attributes=$_GET['Photo'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return Photo the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=Photo::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param Photo $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='photo-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}

}
