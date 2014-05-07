<?php

class GameController extends Controller
{

    public function behaviors()
    {
        return array(
            'eexcelview'=>array(
                'class'=>'ext.eexcelview.EExcelBehavior',
            ),
        );
    }

	private $_answer = array(
		'1_3', '2_2', '3_2'
	);

	public function getRole() {
		return Yii::app()->session['user_role'];
	}

	public function actionIndex()
	{
	}

	public function actionList()
	{
        // if($this->getRole() != 2) {
        //     return;
        // }
		$request = Yii::app()->getRequest();
		$page = $request->getParam("page");
		if (!$page) {
			$page = 1;
		}
		$pagenum = $request->getParam("pagenum");
		if (!$pagenum) {
			$pagenum = 10;
		}

        $start_date = $request->getParam("start_date");
        $end_date = $request->getParam("end_date");

//        echo $start_date."<br>";
//        echo $end_date."<br>";
//        echo intval(strtotime($start_date))."<br>";
//        echo intval(strtotime($end_date))."<br>";
//        die;


		$game = new Game();
		$criteria=new CDbCriteria;
//		if($this->getRole() == 2) {
//		$criteria->select='*,count(tel)';
//		}

		$count = $game->count($criteria);

        $start_date=intval(strtotime($start_date));
        $end_date=intval(strtotime($end_date));

        if($start_date)
        {
            $criteria->addCondition('datetime > :start_date OR datetime = :start_date');
            $criteria->params=array(':start_date'=>$start_date);
        }
        if($end_date)
        {
            $criteria->addCondition('datetime < :end_date OR datetime = :end_date');
            $criteria->params=array_merge($criteria->params,array(':end_date'=>$end_date));
        }



        $criteria->select='*,count(tel)';
		$criteria->limit = $pagenum;
		$criteria->offset = ($page - 1 ) * $pagenum;
        $criteria->group= 'tel';
        $criteria->order = 'datetime DESC';
        $criteria->having='count(tel) < 2';
		$games = $game->findAll($criteria);

		$retdata = array();
		foreach($games as $game) {
			$data = $game->attributes;
			$retdata[] = $data;
		}

		$this->responseJSON($retdata, $count);
	}

	public function actionPost() {
		$request = Yii::app()->getRequest();
		$name = $request->getPost('name');
		$email = $request->getPost('email');
		$tel = $request->getPost('tel');
        $address=$request->getPost('address');
		$game = new Game();
		$game->name = $name;
		$game->email = $email;
		$game->tel = $tel;
        $game->address=$address;
		$game->datetime = time();
		$game->save();
		if($game->validate()) {
			$game->save();
			echo '1';
		}
		else {
			echo '-1';
		}
	}

	public function actionAnswer() {
		$request = Yii::app()->getRequest();
		$answer = $request->getPost('answer');
		if(in_array($answer, $this->_answer)) {
			echo '1';
		}
		else {
			echo '-1';
		}
	}

    /**
     * 导出export。验证管理员权限
     */
    public function actionExport($start_date=NULL,$end_date=NULL,$page=NULL,$pagenum=NULL)
    {
        // if($this->getRole() != 2) {
        //     return;
        // }

        if (!$page) {
            $page = 1;
        }


        $game = new Game();
        $criteria=new CDbCriteria;

        //$count = $game->count($criteria);
        //select *, count(tel) from game group by tel having count(tel) < 2

        $criteria->select='*, count(tel)';
        
        $start_date=intval(strtotime($start_date));
        $end_date=intval(strtotime($end_date));
        // echo $start_date."<br>";
        // echo $end_date;
        // die;

        if($start_date)
        {
            $criteria->addCondition('datetime > :start_date OR datetime = :start_date');
            $criteria->params=array(':start_date'=>$start_date);
        }
        if($end_date)
        {
            $criteria->addCondition('datetime < :end_date OR datetime = :end_date');
            $criteria->params=array_merge($criteria->params,array(':end_date'=>$end_date));
        }

        $criteria->group= 'tel';
        $criteria->order = 'datetime DESC';
        $criteria->having='count(tel) < 2';

        if ($pagenum) {
            $criteria->limit = $pagenum;
            $criteria->offset = ($page - 1 ) * $pagenum;
        }

        $model = $game->findAll($criteria);
//        var_dump($model);

        if($model)
        {
            foreach($model as $key => $value)
            {
                $model[$key]->datetime=date('Y/m/d H:i:s',$value->datetime);
            }
            $title='Export :'.date('Y/m/d H:i:s');
            $this->toExcel($model,array(),$title);
        }
    }

    /**
     * 根据时间筛选参加游戏的人,验证管理员权限
     */
    public function actionSetList($start_date,$end_date,$page=1,$pagenum=NULL)
    {
        if($this->getRole() != 2) {
            return;
        }

        if (!$page) {
            $page = 1;
        }
        if (!$pagenum) {
            $pagenum = 10;
        }

        $game = new Game();
        $criteria=new CDbCriteria;

        $count = $game->count($criteria);
        $criteria->addCondition('(datetime > :start_date OR datetime = :start_date) AND (datetime < :end_date OR datetime = :end_date)');
        $criteria->params=array(':start_date'=>intval(strtotime($start_date)),':end_date'=>intval(strtotime($end_date)));
        $criteria->limit = $pagenum;
        $criteria->offset = ($page - 1 ) * $pagenum;
        $criteria->order = 'datetime DESC';
        $games = $game->findAll($criteria);

        $retdata = array();
        foreach($games as $game) {
            $data = $game->attributes;
            $retdata[] = $data;
        }

        $this->responseJSON($retdata, $count);

    }

}