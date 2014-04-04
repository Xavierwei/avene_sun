-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 04, 2014 at 05:02 AM
-- Server version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `avene_sun`
--

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `gid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tel` int(20) NOT NULL,
  `datetime` varchar(30) NOT NULL,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`gid`, `name`, `email`, `tel`, `datetime`) VALUES
(1, 'sdfjk', 'jfdk@Fd.com', 323333, ''),
(2, 'fdsf', 'fdfds@Fdf.df', 3232323, ''),
(3, 'newsletter', '3jffj@fd.com', 1111, ''),
(4, 'jdfk', 'fjdkf@d.com', 8848, '');

-- --------------------------------------------------------

--
-- Table structure for table `Photo`
--

CREATE TABLE `Photo` (
  `pid` int(25) NOT NULL AUTO_INCREMENT COMMENT 'photo id',
  `weibo_id` bigint(50) NOT NULL,
  `url` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL COMMENT 'image url',
  `screen_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'weibo screen name',
  `gender` varchar(5) NOT NULL,
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sns_uid` bigint(50) NOT NULL COMMENT 'weibo uid',
  `avatar` varchar(255) NOT NULL COMMENT 'weibo avatar url',
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'content',
  `status` int(1) NOT NULL,
  `datetime` int(11) NOT NULL,
  PRIMARY KEY (`pid`),
  UNIQUE KEY `pid` (`pid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `Photo`
--

INSERT INTO `Photo` (`pid`, `weibo_id`, `url`, `image`, `screen_name`, `gender`, `location`, `sns_uid`, `avatar`, `content`, `status`, `datetime`) VALUES
(1, 3695406183721313, 'AE1WWfC5b', '/upload/20140403/3695406183721313.jpg', '貓汏咪', 'f', '上海 浦东新区', 1884061974, 'http://tp3.sinaimg.cn/1884061974/50/40033102701/0', '', 1, 1396536999),
(2, 3695406180278722, 'AE1WW1avw', '/upload/20140403/3695406180278722.jpg', 'Mr張_JN', 'm', '湖北 武汉', 1965775613, 'http://tp2.sinaimg.cn/1965775613/50/5690595271/1', '我想问问，狗鱼鸟也能寄？！！！', 1, 1396537000),
(3, 3695406179802331, 'AE1WVF827', '/upload/20140403/3695406179802331.jpg', '_E莱文E莱文_伱又肥肥肥了哇', 'f', '上海 黄浦区', 1793316312, 'http://tp1.sinaimg.cn/1793316312/50/40010888024/0', '保湿美肤没她怎么行 ', 1, 1396537004),
(4, 3695406179802253, 'AE1WVF80R', '/upload/20140403/3695406179802253.jpg', '为世勋失心', 'f', '四川 眉山', 3833535754, 'http://tp3.sinaimg.cn/3833535754/50/5688032066/0', '哈哈[憨笑] http://t.cn/z8dGsTF', 1, 1396537004),
(5, 3695420767688216, 'AE2kswg3u', '/upload/20140403/3695420767688216.jpg', 'VitaDolce_S', 'f', '山西 大同', 2712314714, 'http://tp3.sinaimg.cn/2712314714/50/5686925210/0', '《2ne1 AON香港》 http://t.cn/8siCeed  （分享自 @土豆娱乐）喜欢', 1, 1396540438),
(6, 3695420767688048, 'AE2kswg0M', '/upload/20140403/3695420767688048.jpg', 'Maria铃语', 'f', '河南 开封', 3878493453, 'http://tp2.sinaimg.cn/3878493453/50/5683538772/0', '▲「长袖卫衣」卡通印花男女款 ｜>>>http://t.cn/8sGQeNp', 1, 1396540439),
(7, 3695420767688003, 'AE2kswg03', '/upload/20140403/3695420767688003.jpg', '乐善好施主', 'f', '江苏 南京', 5081427078, 'http://tp3.sinaimg.cn/5081427078/50/5690383124/0', '奥特曼春款正品男装夹克 薄 男修身韩版 纯棉商务休闲立领男士夹克外套  http://t.cn/8sZ4qEF', 1, 1396540439),
(8, 3695420767230755, 'AE2ksul35', '/upload/20140403/3695420767230755.jpg', '淘宝潮女装店', 'f', '北京 东城区', 3715425367, 'http://tp4.sinaimg.cn/3715425367/50/22851044617/0', '半边的风景，馨香入梦~~~>>>http://t.cn/8FoB1Rx[din推撞]', 1, 1396540440),
(9, 3695420763493511, 'AE2kseEOX', '/upload/20140403/3695420763493511.jpg', '雨伊的百合花雪', 'f', '贵州 黔南', 3963789565, 'http://tp2.sinaimg.cn/3963789565/50/5683481706/0', '月销量2332 件春装新款男外套 夹克男士春秋季薄款商务休闲茄克青年潮男装http://t.cn/8sZ5ZHp', 1, 1396540440),
(10, 3695420763493232, 'AE2kseEKs', '/upload/20140403/3695420763493232.jpg', '摸能凉渴', 'm', '新疆 克孜勒苏', 5060679095, 'http://tp4.sinaimg.cn/5060679095/50/5689824014/1', '千年女优：[★★★★]今敏有意混乱真实与幻想两种感觉，在频繁穿梭中，情感中心一直不停地挖掘人类内心的深处，在他的内心回音壁里，是人类集体感情的反复震荡，因为这种震荡伴随着每个人的一生。可能是因为爱情主题的缘故，它甚至没有前作《未麻的部屋》的吸引力，但是爱情对于这个主题也许最为合适。', 1, 1396540440),
(11, 3695420763493025, 'AE2kseEH7', '/upload/20140403/3695420763493025.jpg', '李小麦同学蓓', 'f', '黑龙江 哈尔滨', 3847648536, 'http://tp1.sinaimg.cn/3847648536/50/40036083473/0', 'swjfe月销量1307件新款男士长袖衬衣潮流中山立领衬衫韩版修身衣服http://t.cn/8FsSk8Q', 1, 1396540441),
(12, 3695420763492978, 'AE2kseEGm', '/upload/20140403/3695420763492978.jpg', 'sadcbd', 'f', '河南 开封', 5079225135, 'http://tp4.sinaimg.cn/5079225135/50/5690380724/0', '笑哈哈2014春季杰克新品琼斯男士夹克男士外套商务休闲夹克男修身jacket  http://t.cn/8szy5yo', 1, 1396540441),
(13, 3695420763492761, 'AE2kseECR', '/upload/20140403/3695420763492761.jpg', 'Frederica_Xyt莹婷尹', 'f', '甘肃 嘉峪关', 3753782851, 'http://tp4.sinaimg.cn/3753782851/50/40032702751/0', 'BJrda30天内已售出 108 件连衣裙长袖针织显瘦修身羊毛春秋连衣裙http://t.cn/8FsOb5n', 1, 1396540442),
(14, 3695420763492528, 'AE2kseEz6', '/upload/20140403/3695420763492528.jpg', '安卓动态', 'm', '广东 广州', 2828330482, 'http://tp3.sinaimg.cn/2828330482/50/5634182601/1', '给妈妈万物复苏好心情~~~>>>http://t.cn/8FH5wLp[ok]', 1, 1396540442),
(15, 3695420868388295, 'AE2kCzcb5', '/upload/20140403/3695420868388295.jpg', '郝喆是谁', 'f', '广东 深圳', 2695862533, 'http://tp2.sinaimg.cn/2695862533/50/5666737975/0', '新生绿芽，生命的开始，伴着泥土安静的生长。我正在使用"绿芽"封面图，好漂亮，你们都快来试试！http://t.cn/zRViZSk', 1, 1396540492),
(16, 3695420868388294, 'AE2kCzcb4', '/upload/20140403/3695420868388294.jpg', 'move_me杭v5', 'f', '广西 南宁', 3319692645, 'http://tp2.sinaimg.cn/3319692645/50/40025552313/0', 'jpsCw30天内已售出 115 件原创春装新款女装 欧美百搭花朵印花格子连体裤显瘦长裤女http://t.cn/8sGn2Db', 1, 1396540492),
(17, 3695420868388024, 'AE2kCzc6I', '/upload/20140403/3695420868388024.jpg', 'YOOYEE权', 'f', '吉林 长春', 3762713017, 'http://tp2.sinaimg.cn/3762713017/50/40032750544/0', 'sW1UI月销量139件男式皮衣 春装新款男士修身外套 男装机车PU皮夹克外套男http://t.cn/8sZIgqw', 1, 1396540493),
(18, 3695420868387899, 'AE2kCzc4H', '/upload/20140403/3695420868387899.jpg', '在这里读懂成都', 'f', '四川 成都', 2821789325, 'http://tp2.sinaimg.cn/2821789325/50/5639450987/0', '简单中美丽~~~>>>http://t.cn/8FEImum[猪头]', 1, 1396540493),
(19, 3695420868387486, 'AE2kCzbY2', '/upload/20140403/3695420868387486.jpg', 'king123ofworld', 'f', '河南 洛阳', 5079535835, 'http://tp4.sinaimg.cn/5079535835/50/5690375260/0', '转发Kanmi商务男士正装长袖衬衫修身撞色法式衬衣春装新款K-G2000  http://t.cn/8sZ4WyO', 1, 1396540494),
(20, 3695420868387485, 'AE2kCzbY1', '/upload/20140403/3695420868387485.jpg', 'UUyxxCrazy', 'f', '浙江', 2063495730, 'http://tp3.sinaimg.cn/2063495730/50/5683475504/0', '分享 Troye Sivan 的歌曲《The One That Got Away》http://t.cn/8sJHHZa（分享自 @虾米音乐） http://t.cn/8siNhhF ', 1, 1396540495),
(21, 3695420868387483, 'AE2kCzbXZ', '/upload/20140403/3695420868387483.jpg', '火星人在蓝星y', 'm', '浙江 台州', 2963231992, 'http://tp1.sinaimg.cn/2963231992/50/40019662066/1', '【奇瑞一直以来有个梦想：将中国汽车打入国际市场】在历经了M14的难产、瑞麒的低迷，奇瑞终于找到了通向“世界好汽车”的捷径——全球合作。2007年，奇瑞汽车和以色列集团合资的观致汽车正式成立。作为观致汽车的开山之作，观致3 轿车从设计上可以很明显地看出观致面向全球的雄心。', 1, 1396540495),
(22, 3695420868387304, 'AE2kCzbV6', '/upload/20140403/3695420868387304.jpg', '助您康乐_爽', 'm', '其他', 3187239484, 'http://tp1.sinaimg.cn/3187239484/50/40016734428/1', 'The woman must withstand lies, bear perfunctory, can bear the deceit, forgot the promise, put down everything.女人一定要经得起假话，受得起敷衍，忍得住欺骗，忘得了诺言，放得下一切。', 1, 1396540496),
(23, 3695420868387110, 'AE2kCzbRY', '/upload/20140403/3695420868387110.jpg', '舙飝Sugar_Wu', 'm', '辽宁 丹东', 3880483681, 'http://tp2.sinaimg.cn/3880483681/50/5678085382/1', '从此，更加坚定了毁灭这个世界所有汪星人的决心，猫根·弗里曼（创世纪喵星人第一代领袖）', 1, 1396540496),
(24, 3695420961105758, 'AE2kM4DEO', '/upload/20140403/3695420961105758.jpg', '世代光大', 'm', '天津 河北区', 5071594743, 'http://tp4.sinaimg.cn/5071594743/50/5689897752/1', '1、把看不顺的人看顺；2、把看不起的人看起；3、把不想做的事做好；4、把想不通的事想通；5、把快骂出的话收回；6、把咽不下气的咽下；7、把想放纵的心收住；——你不需每时每刻这样做，但这样多做几回，你就会：情商高了，职位升了，工资涨了，人爽了。', 1, 1396540504),
(25, 3695420960431722, 'AE2kM1Ojg', '/upload/20140403/3695420960431722.jpg', '科技达人营', 'm', '上海', 2838614274, 'http://tp3.sinaimg.cn/2838614274/50/5634992890/1', '神一样的灵性~~~>>>http://t.cn/8FHbfZW[阴险]', 1, 1396540504),
(26, 3695420960431533, 'AE2kM1Ogd', '/upload/20140403/3695420960431533.jpg', '7fish_', 'f', '重庆 合川区', 2183301007, 'http://tp4.sinaimg.cn/2183301007/50/5678967004/0', '在你心上用力的开一枪', 1, 1396540505),
(27, 3695420960431449, 'AE2kM1OeR', '/upload/20140403/3695420960431449.jpg', 'zhulinvic', 'f', '其他', 1749965344, 'http://tp1.sinaimg.cn/1749965344/50/5690611500/0', '20140403 会努力过的更好，小伙伴儿们，回见。 我在这里:http://t.cn/8ktiG0r', 1, 1396540505),
(28, 3695420960431217, 'AE2kM1Ob7', '/upload/20140403/3695420960431217.jpg', '疯狂幻想者', 'm', '其他', 3211608644, 'http://tp1.sinaimg.cn/3211608644/50/0/1', '跳跳球是一个手机威客，客户通过完成任务赚取佣金，推荐给朋友获取分成。通过任务完成后会随机掉落矿石，在熔炉中熔炼可以得到多种有趣的商品哦。  http://t.cn/8siNhFO', 1, 1396540506),
(29, 3695420960237324, 'AE2kM0ZJO', '/upload/20140403/3695420960237324.jpg', '淘宝气质女装搜集', 'f', '北京 东城区', 3712130485, 'http://tp2.sinaimg.cn/3712130485/50/22850954864/0', '小豆子养出细嫩的肌肤~~~>>>http://t.cn/8sMWy5A[蛋糕]', 1, 1396540506),
(30, 3695420960237195, 'AE2kM0ZHJ', '/upload/20140403/3695420960237195.jpg', 'ZCX130', 'f', '江苏 无锡', 5075607652, 'http://tp1.sinaimg.cn/5075607652/50/5690103538/0', 'bm可爱男士长裤中国风功夫裤中式改良唐装裤子太极裤棉麻直筒大码休闲裤  http://t.cn/8sZ49QK', 1, 1396540507);

-- --------------------------------------------------------

--
-- Table structure for table `Trial`
--

CREATE TABLE `Trial` (
  `tid` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `datetime` varchar(20) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'user name',
  `screen_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'password',
  `salt` varchar(30) NOT NULL COMMENT 'salt',
  `sns_uid` varchar(50) NOT NULL,
  `access_token` varchar(50) NOT NULL,
  `avatar` varchar(150) NOT NULL,
  `tel` int(15) NOT NULL,
  `gender` varchar(5) NOT NULL,
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` int(5) NOT NULL,
  `reg_datetime` int(16) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`uid`, `username`, `screen_name`, `password`, `salt`, `sns_uid`, `access_token`, `avatar`, `tel`, `gender`, `location`, `role`, `reg_datetime`) VALUES
(1, '猪哥小凌', '', '', '', '1856415417', '2.00J91dBCuMB5zDb2edc97c8ajTvfMC2', 'http://tp2.sinaimg.cn/1856415417/180/5638235242/1', 0, '', '', 0, 1391492054),
(2, 'avene', '', '6a635240c25aa65985d678dfa77c4b0b', '', '', '', '', 0, '', '', 2, 0),
(3, 'fuel-it-up', 'fuel-it-up', '', '', '3164070184', '2.00EMHI9DuMB5zD0d1a992d560qZyRO', 'http://tp1.sinaimg.cn/3164070184/180/40026419140/1', 0, 'm', '上海 卢湾区', 0, 1391777894);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
