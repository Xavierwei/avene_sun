<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/column1';
	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu=array();
	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();

	// 辅助方法
	public function isPost() {
		return Yii::app()->getRequest()->isPostRequest;
	}

	public function isPut() {
		return Yii::app()->getRequest()->isPutRequest;
	}

	public function responseError($message) {
		$this->_renderjson($this->wrapperDataInRest(NULL, $message, TRUE));
	}

	public function responseJSON($data, $message, $ext = array()) {
		$this->_renderjson($this->wrapperDataInRest($data, $message, FALSE, $ext));
	}

	public function wrapperDataInRest($data, $message = '', $error = FALSE, $ext = array()) {
		$json = array(
			"success" => !$error,
			"message" => $message,
			"data" => $data
		);

		if (!empty($ext)) {
			$json += $ext;
		}

		return $json;
	}

	private function _renderjson($data) {
		header("Content-Type: application/json; charset=UTF-8");
		print CJavaScript::jsonEncode($data);
		die();
	}
}