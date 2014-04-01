<?php

/**
 * This is the model class for table "Photo".
 *
 * The followings are the available columns in table 'Photo':
 * @property integer $pid
 * @property string $weibo_id
 * @property string $image
 * @property string $screen_name
 * @property string $gender
 * @property string $location
 * @property string $sns_uid
 * @property string $avatar
 * @property string $content
 * @property integer $status
 * @property integer $datetime
 */
class Photo extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'Photo';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('weibo_id, image, screen_name, gender, location, sns_uid, avatar, content, status, datetime', 'required'),
			array('status, datetime', 'numerical', 'integerOnly'=>true),
			array('weibo_id, sns_uid', 'length', 'max'=>50),
			array('image, screen_name, location, avatar', 'length', 'max'=>255),
			array('gender', 'length', 'max'=>5),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('pid, weibo_id, url, image, screen_name, gender, location, sns_uid, avatar, content, status, datetime', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'pid' => 'photo id',
			'weibo_id' => 'Weibo',
			'image' => 'image url',
			'screen_name' => 'weibo screen name',
			'gender' => 'Gender',
			'location' => 'Location',
			'sns_uid' => 'weibo uid',
			'avatar' => 'weibo avatar url',
			'content' => 'content',
			'status' => 'Status',
			'datetime' => 'Datetime',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('pid',$this->pid);
		$criteria->compare('weibo_id',$this->weibo_id,true);
		$criteria->compare('image',$this->image,true);
		$criteria->compare('screen_name',$this->screen_name,true);
		$criteria->compare('gender',$this->gender,true);
		$criteria->compare('location',$this->location,true);
		$criteria->compare('sns_uid',$this->sns_uid,true);
		$criteria->compare('avatar',$this->avatar,true);
		$criteria->compare('content',$this->content,true);
		$criteria->compare('status',$this->status);
		$criteria->compare('datetime',$this->datetime);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Photo the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function fetchContents($contents){
		foreach($contents as $weibo) {
			if(isset($weibo['original_pic'])) {
				$oldPhoto = Photo::model()->findByAttributes(array('weibo_id'=>$weibo['id']));
				if($oldPhoto) {
					continue;
				}
				// Fetch Image
				$filename = $this->fetchImage($weibo);
				if($filename) {
					$urlJson = json_decode(file_get_contents("http://api.t.sina.com.cn/querymid.json?id=".$weibo['id']));
					$photo = new Photo();
					$photo->weibo_id = $weibo['id'];
					$photo->url = $urlJson->mid;
					$photo->image = $filename;
					$photo->screen_name = $weibo['user']['screen_name'];
					$photo->sns_uid = $weibo['user']['id'];
					$photo->gender = $weibo['user']['gender'];
					$photo->location = $weibo['user']['location'];
					$photo->avatar = $weibo['user']['profile_image_url'];
					$photo->content = $weibo['text'];
					$photo->status = 0;
					$photo->datetime = time();
					$photo->save();
				}
			}
		}
	}


	private function fetchImage($weibo){
		$imgPath = '/upload/'.date('Ymd').'/';
		if (!is_dir(ROOT_PATH.$imgPath)) {
			mkdir(ROOT_PATH.$imgPath, 0777, TRUE);
		}
		$imageString = file_get_contents($weibo['original_pic']);
		$filename = $imgPath.$weibo['id'].'.jpg';
		$save = file_put_contents(ROOT_PATH.$filename, $imageString);
		if($save) {
			$thumb = new EasyImage(ROOT_PATH.$filename);
			$size = getimagesize(ROOT_PATH.$filename);
			$w = 190;
			$h = 190;
			$s_w = $size[0];
			$s_h = $size[1];

			$r1 = $w / $s_w;
			$r2 = $h / $s_h;
			$widthSamller = TRUE;
			if ($r1 > $r2) {
				$r = $r1;
			}
			else {
				$widthSamller = FALSE;
				$r = $r2;
			}
			$t_w = $r * $s_w;
			$t_h = $r * $s_h;

			// 先等比例 resize
			$thumb->resize($t_w, $t_h);
			// 再裁剪
			// 裁剪 多余的宽
			if (!$widthSamller) {
				$start_x = ($t_w - $w)/2;
				$start_y = 0;
				$thumb->crop($w, $h, $start_x, $start_y);
			}
			// 裁剪多余的 高
			else {
				$start_x = 0;
				$start_y = ($t_h - $h);
				$thumb->crop($w, $h, $start_x, $start_y);
			}
			$thumb->save(ROOT_PATH.$imgPath.$weibo['id'].'_thumb.jpg');
			return $filename;
		}
		else {
			return false;
		}
	}


  public function fetchProxyContents($contents){
    foreach($contents as $weibo) {
      $oldPhoto = $this->findByAttributes(array('weibo_id'=>$weibo->weibo_id));
      if($oldPhoto) {
        continue;
      }
      // Fetch Image
      $filename = $this->fetchProxyImage(Yii::app()->params['proxyServer'].$weibo->image,$weibo->weibo_id);
      if($filename) {
        $photo = new Photo();
        $photo->weibo_id = $weibo->weibo_id;
        $photo->url = $weibo->url;
        $photo->image = $filename;
        $photo->screen_name = $weibo->screen_name;
        $photo->sns_uid = $weibo->sns_uid;
        $photo->gender = $weibo->gender;
        $photo->location = $weibo->location;
        $photo->avatar = $weibo->avatar;
        $photo->content = $weibo->content;
        $photo->status = 0;
        $photo->datetime = time();
        $photo->save();
      }
    }
  }

	public function fetchProxyImage($photoUpload, $weibo_id){
    $imgPath = '/upload/'.date('Ymd').'/';
    if (!is_dir(ROOT_PATH.$imgPath)) {
      mkdir(ROOT_PATH.$imgPath, 0777, TRUE);
    }
    $imageString = file_get_contents($photoUpload);
    $filename = $imgPath.$weibo_id.'.jpg';
    $save = file_put_contents(ROOT_PATH.$filename, $imageString);
    if($save) {
      $thumb = new EasyImage(ROOT_PATH.$filename);
      $size = getimagesize(ROOT_PATH.$filename);
      $w = 190;
      $h = 190;
      $s_w = $size[0];
      $s_h = $size[1];

      $r1 = $w / $s_w;
      $r2 = $h / $s_h;
      $widthSamller = TRUE;
      if ($r1 > $r2) {
        $r = $r1;
      }
      else {
        $widthSamller = FALSE;
        $r = $r2;
      }
      $t_w = $r * $s_w;
      $t_h = $r * $s_h;

      // 先等比例 resize
      $thumb->resize($t_w, $t_h);
      // 再裁剪
      // 裁剪 多余的宽
      if (!$widthSamller) {
        $start_x = ($t_w - $w)/2;
        $start_y = 0;
        $thumb->crop($w, $h, $start_x, $start_y);
      }
      // 裁剪多余的 高
      else {
        $start_x = 0;
        $start_y = ($t_h - $h);
        $thumb->crop($w, $h, $start_x, $start_y);
      }
      $thumb->save(ROOT_PATH.$imgPath.$weibo_id.'_thumb.jpg');
      return $filename;
    }
    else {
      return false;
    }
	}


	public function getAllPhotos() {
		$criteria=new CDbCriteria;
		$criteria->select='*';
    $criteria->limit = 50;
    $criteria->order = 'datetime DESC';
		$photos = $this->findAll($criteria);
    return $photos;

//		foreach($photos as $photo) {
//			$res = $photo->attributes;
//			$res['image'] = new CurlFile('filename.png', 'image/png', 'filename.png');
//			$ch = curl_init();
//			curl_setopt($ch, CURLOPT_POSTFIELDS, $res);
//			curl_setopt($ch, CURLOPT_URL, 'http://localhost/ave_photowall/photo/weibopost');
//			curl_setopt($ch, CURLOPT_POST, 1);
//			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
//			$result = curl_exec($ch);
//			print_r($result);
//		}

	}

	/**
	 * 获取统计信息
	 */
	public function getStatistics() {
		$all = Yii::app()->db->createCommand()
			->select('count(*) as count')
			->from('Photo')
			->queryRow();

		$approved = Yii::app()->db->createCommand()
			->select('count(*) as count')
			->from('Photo')
			->where('status = 1')
			->queryRow();

		$unapproved = Yii::app()->db->createCommand()
			->select('count(*) as count')
			->from('Photo')
			->where('status = 0')
			->queryRow();


		$count['approved'] = $approved['count'];
		$count['unapproved'] = $unapproved['count'];
		$count['all'] = $all['count'];

		return $count;
	}




}
