<?php

/**
 * This is the model class for table "Game".
 *
 * The followings are the available columns in table 'Game':
 * @property integer $gid
 * @property string $name
 * @property string $email
 * @property string $tel
 * @property string $address
 */
class Game extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */

  public $detail;

	public function tableName()
	{
		return 'Game';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, email, tel', 'required'),
			array('name, email, tel', 'length', 'max'=>255),
			array('address','length','max'=>512),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('gid, name, email, tel, address', 'safe', 'on'=>'search'),
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
			'gid' => 'gid',
			'name' => 'name',
			'email' => 'email',
			'tel' => 'tel',
			'address'=>'address',
		);
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
