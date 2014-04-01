<?php

/**
 * This is the model class for table "Winner".
 *
 * The followings are the available columns in table 'Winner':
 * @property integer $wid
 * @property integer $month
 * @property string $photo
 * @property string $name
 * @property string $avatar
 * @property string $tel
 * @property string $prize
 * @property string $prize_img
 */
class Winner extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */

  public $detail;

	public function tableName()
	{
		return 'Winner';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('month, photo, name, avatar, prize, prize_img', 'required'),
			array('month', 'numerical', 'integerOnly'=>true),
			array('photo, name, avatar, prize, prize_img', 'length', 'max'=>255),
			array('tel', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('wid, month, photo, url ,mid, name, avatar, tel, prize, prize_img', 'safe', 'on'=>'search'),
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
			'wid' => 'Wid',
			'month' => 'Month',
			'photo' => 'Photo',
			'name' => 'Name',
			'avatar' => 'Avatar',
			'tel' => 'Tel',
			'prize' => 'Prize',
			'prize_img' => 'Prize Img',
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

		$criteria->compare('wid',$this->wid);
		$criteria->compare('month',$this->month);
		$criteria->compare('photo',$this->photo,true);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('avatar',$this->avatar,true);
		$criteria->compare('tel',$this->tel,true);
		$criteria->compare('prize',$this->prize,true);
		$criteria->compare('prize_img',$this->prize_img,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Winner the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
