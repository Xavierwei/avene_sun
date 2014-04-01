<?php

/**
 * This is the model class for table "User".
 *
 * The followings are the available columns in table 'User':
 * @property integer $uid
 * @property string $username
 * @property string $screen_name
 * @property string $password
 * @property string $salt
 * @property string $sns_uid
 * @property string $access_token
 * @property string $avatar
 * @property integer $tel
 * @property string $gender
 * @property string $location
 * @property integer $role
 * @property integer $reg_datetime
 */
class User extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'User';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('uid, username, screen_name, password, salt, sns_uid, access_token, avatar, tel, gender, location, role, reg_datetime', 'required'),
			array('uid, tel, role, reg_datetime', 'numerical', 'integerOnly'=>true),
			array('username, screen_name, password, location', 'length', 'max'=>255),
			array('salt', 'length', 'max'=>30),
			array('sns_uid, access_token', 'length', 'max'=>50),
			array('avatar', 'length', 'max'=>150),
			array('gender', 'length', 'max'=>5),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('uid, username, screen_name, password, salt, sns_uid, access_token, avatar, tel, gender, location, role, reg_datetime', 'safe', 'on'=>'search'),
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
			'uid' => 'user id',
			'username' => 'user name',
			'screen_name' => 'Screen Name',
			'password' => 'password',
			'salt' => 'salt',
			'sns_uid' => 'Sns Uid',
			'access_token' => 'Access Token',
			'avatar' => 'Avatar',
			'tel' => 'Tel',
			'gender' => 'Gender',
			'location' => 'Location',
			'role' => 'Role',
			'reg_datetime' => 'Reg Datetime',
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

		$criteria->compare('uid',$this->uid);
		$criteria->compare('username',$this->username,true);
		$criteria->compare('screen_name',$this->screen_name,true);
		$criteria->compare('password',$this->password,true);
		$criteria->compare('salt',$this->salt,true);
		$criteria->compare('sns_uid',$this->sns_uid,true);
		$criteria->compare('access_token',$this->access_token,true);
		$criteria->compare('avatar',$this->avatar,true);
		$criteria->compare('tel',$this->tel);
		$criteria->compare('gender',$this->gender,true);
		$criteria->compare('location',$this->location,true);
		$criteria->compare('role',$this->role);
		$criteria->compare('reg_datetime',$this->reg_datetime);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return User the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
