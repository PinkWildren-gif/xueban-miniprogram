// utils/data.js — 学伴 tutor database (full port of demo3-xueban/data.js)
// 24 tutors · 39 reviews · 37 textbooks — static seed data.
// When CloudBase is connected, this file is replaced by cloud queries (see CLOUDBASE-SETUP.md).

const store = require('./store.js');

const TUTORS = [
  {
    "id": 1,
    "name": "赵娟",
    "gender": "女",
    "age": 35,
    "school": "云南师范大学 · 汉语言文学",
    "title": "在职一级教师",
    "subjects": [
      "数学",
      "语文"
    ],
    "primarySubject": "数学",
    "category": "学科",
    "grades": [
      "小学"
    ],
    "books": [
      "人教·数学·五上",
      "人教·数学·五下",
      "人教·数学·六上",
      "人教·数学·四上",
      "人教·语文·五上"
    ],
    "tags": [
      "人教版精通",
      "一级教师",
      "8年经验",
      "作文专项"
    ],
    "years": 10,
    "students": 200,
    "price": 160,
    "rating": 5,
    "reviews": 210,
    "district": "西山区",
    "city": "昆明",
    "bio": "云师大汉语言文学专业，10年小学语文和数学教学经验。在职一级教师。擅长阅读与作文，学生作文多次在省市级比赛获奖。曾参与人教版教辅编写，深度熟悉小学各年级教材结构。",
    "style": "情景教学 · 循序渐进",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证",
      "一级教师"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": true,
    "color": "linear-gradient(135deg,#16a34a,#14532d)"
  },
  {
    "id": 2,
    "name": "李明",
    "gender": "男",
    "age": 28,
    "school": "云南师范大学 · 数学研究生",
    "title": "数学研究生",
    "subjects": [
      "数学"
    ],
    "primarySubject": "数学",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·数学·七上",
      "人教·数学·八下",
      "人教·数学·九上",
      "人教·数学·必修一",
      "人教·数学·必修二"
    ],
    "tags": [
      "中考冲刺",
      "高考冲刺",
      "思维导图",
      "云师大"
    ],
    "years": 5,
    "students": 80,
    "price": 180,
    "rating": 4.9,
    "reviews": 127,
    "district": "五华区",
    "city": "昆明",
    "bio": "云南师范大学数学专业研究生，5年一线教学经验。擅长用思维导图帮助学生建立知识体系，累计帮助80+名学生提升成绩。去年带的8名初三学生中7人考入昆一中。",
    "style": "思维引导型 · 因材施教",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": true,
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)"
  },
  {
    "id": 3,
    "name": "王芳",
    "gender": "女",
    "age": 26,
    "school": "云南大学 · 外国语学院",
    "title": "云大英语 · 雅思8.0",
    "subjects": [
      "英语"
    ],
    "primarySubject": "英语",
    "category": "学科",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [
      "人教·英语·五上",
      "人教·英语·六上",
      "人教·英语·七上",
      "人教·英语·八下"
    ],
    "tags": [
      "雅思8.0",
      "沉浸式口语",
      "兴趣导向",
      "云大"
    ],
    "years": 3,
    "students": 60,
    "price": 150,
    "rating": 4.8,
    "reviews": 98,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "云南大学英语专业，雅思8.0。擅长小初衔接，让孩子从'哑巴英语'转为敢说敢用。课堂生动有趣，家长反馈孩子学习兴趣明显提升。",
    "style": "沉浸式口语 · 兴趣导向",
    "verified": [
      "实名认证",
      "学历核验",
      "雅思证书"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#E91E63,#AD1457)"
  },
  {
    "id": 4,
    "name": "张伟",
    "gender": "男",
    "age": 32,
    "school": "昆明理工大学 · 物理系",
    "title": "昆工物理硕士",
    "subjects": [
      "物理"
    ],
    "primarySubject": "物理",
    "category": "学科",
    "grades": [
      "高中"
    ],
    "books": [
      "人教·物理·必修一",
      "人教·物理·必修二",
      "人教·物理·选修3-1"
    ],
    "tags": [
      "高考物理",
      "命题规律",
      "题型分类"
    ],
    "years": 8,
    "students": 150,
    "price": 220,
    "rating": 4.9,
    "reviews": 156,
    "district": "呈贡区",
    "city": "昆明",
    "bio": "昆工物理系硕士，8年高中物理教学经验。曾在昆明一中实习任教，深谙云南高考物理命题规律。带过的学生高考物理平均提分25分。",
    "style": "题型分类 · 高考专项",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": true,
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)"
  },
  {
    "id": 5,
    "name": "陈刚",
    "gender": "男",
    "age": 30,
    "school": "中央音乐学院 · 钢琴系",
    "title": "央院钢琴硕士",
    "subjects": [
      "钢琴"
    ],
    "primarySubject": "钢琴",
    "category": "艺术",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [],
    "tags": [
      "央院硕士",
      "考级辅导",
      "古典钢琴",
      "大师课"
    ],
    "years": 6,
    "students": 45,
    "price": 300,
    "rating": 4.9,
    "reviews": 87,
    "district": "五华区",
    "city": "昆明",
    "bio": "中央音乐学院钢琴演奏硕士毕业，回昆明发展6年。带出多名央院、上音附中考生。注重基本功与音乐表现力并重。",
    "style": "古典系统 · 严谨扎实",
    "verified": [
      "实名认证",
      "学历核验",
      "演出履历"
    ],
    "mode": [
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#5E35B1,#311B92)"
  },
  {
    "id": 6,
    "name": "刘静",
    "gender": "女",
    "age": 40,
    "school": "云南省书法家协会",
    "title": "省书协会员",
    "subjects": [
      "书法"
    ],
    "primarySubject": "书法",
    "category": "艺术",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [],
    "tags": [
      "软笔书法",
      "硬笔书法",
      "12年经验",
      "素质教育"
    ],
    "years": 12,
    "students": 180,
    "price": 120,
    "rating": 4.8,
    "reviews": 64,
    "district": "官渡区",
    "city": "昆明",
    "bio": "云南省书法家协会会员，从事青少年书法教学12年。作品多次入选省级展览。认为书法不仅是写字，更是修身养性。",
    "style": "传统临帖 · 品格培养",
    "verified": [
      "实名认证",
      "学历核验",
      "协会会员",
      "作品集"
    ],
    "mode": [
      "上门",
      "线下机构"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#8D6E63,#4E342E)"
  },
  {
    "id": 7,
    "name": "杨帆",
    "gender": "男",
    "age": 29,
    "school": "昆明理工 · 计算机硕士",
    "title": "前华为工程师",
    "subjects": [
      "编程"
    ],
    "primarySubject": "编程",
    "category": "素质",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [],
    "tags": [
      "少儿Python",
      "Scratch",
      "信息学奥赛",
      "华为前端"
    ],
    "years": 4,
    "students": 55,
    "price": 200,
    "rating": 4.9,
    "reviews": 72,
    "district": "呈贡区",
    "city": "昆明",
    "bio": "昆工计算机硕士，华为前端工程师，2年前回昆明专注少儿编程教育。带的学生多名获全国青少年信息学奥赛省级奖项。",
    "style": "项目驱动 · 兴趣养成",
    "verified": [
      "实名认证",
      "学历核验",
      "大厂背景"
    ],
    "mode": [
      "线上",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#00897B,#004D40)"
  },
  {
    "id": 8,
    "name": "孙悦",
    "gender": "女",
    "age": 27,
    "school": "云南艺术学院 · 国画专业",
    "title": "云艺国画毕业",
    "subjects": [
      "美术"
    ],
    "primarySubject": "美术",
    "category": "艺术",
    "grades": [
      "小学"
    ],
    "books": [],
    "tags": [
      "儿童画",
      "国画",
      "素描入门",
      "云艺"
    ],
    "years": 3,
    "students": 40,
    "price": 130,
    "rating": 4.7,
    "reviews": 53,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "云艺国画专业毕业，擅长引导孩子从涂鸦到系统学习。课堂氛围轻松，让孩子在快乐中建立审美与创造力。",
    "style": "启发式 · 快乐绘画",
    "verified": [
      "实名认证",
      "学历核验"
    ],
    "mode": [
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#FF7043,#D84315)"
  },
  {
    "id": 9,
    "name": "王磊",
    "gender": "男",
    "age": 58,
    "school": "云南民族大学 · 退休数学教师",
    "title": "退休特级教师",
    "subjects": [
      "数学"
    ],
    "primarySubject": "数学",
    "category": "学科",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [
      "人教·数学·五上",
      "人教·数学·五下",
      "人教·数学·六上",
      "人教·数学·七上"
    ],
    "tags": [
      "25年教龄",
      "特级教师",
      "经验丰富",
      "价格亲民"
    ],
    "years": 25,
    "students": 350,
    "price": 120,
    "rating": 4.8,
    "reviews": 167,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "云南民族大学附中退休数学教师，25年一线教学经验。退休返聘，耐心好，价格亲民，深受家长信赖。擅长打好小学数学基础。",
    "style": "循循善诱 · 基础扎实",
    "verified": [
      "实名认证",
      "学历核验",
      "特级教师"
    ],
    "mode": [
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#ea580c,#9a3412)"
  },
  {
    "id": 10,
    "name": "陈莹",
    "gender": "女",
    "age": 27,
    "school": "云南大学 · 教育学硕士",
    "title": "教育学硕士",
    "subjects": [
      "数学",
      "语文"
    ],
    "primarySubject": "综合",
    "category": "学科",
    "grades": [
      "小学"
    ],
    "books": [
      "人教·数学·三上",
      "人教·数学·四上",
      "人教·数学·五上",
      "北师大·数学·四上"
    ],
    "tags": [
      "教育学硕士",
      "多版本教材",
      "低年级",
      "沟通良好"
    ],
    "years": 4,
    "students": 80,
    "price": 150,
    "rating": 4.7,
    "reviews": 92,
    "district": "官渡区",
    "city": "昆明",
    "bio": "云大教育学硕士，专注小学低年级教学。熟悉人教版、北师大版等多个主流教材版本。善于沟通，家长反馈孩子学习积极性明显提升。",
    "style": "低年级启蒙 · 循序渐进",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#0ea5e9,#075985)"
  },
  {
    "id": 11,
    "name": "刘洋",
    "gender": "男",
    "age": 24,
    "school": "华中师大 · 教育技术本科",
    "title": "年轻化教学",
    "subjects": [
      "数学"
    ],
    "primarySubject": "数学",
    "category": "学科",
    "grades": [
      "小学"
    ],
    "books": [
      "人教·数学·五上",
      "人教·数学·六上",
      "人教·数学·四上"
    ],
    "tags": [
      "年轻活力",
      "游戏化教学",
      "iPad工具"
    ],
    "years": 3,
    "students": 40,
    "price": 140,
    "rating": 4.8,
    "reviews": 68,
    "district": "呈贡区",
    "city": "昆明",
    "bio": "华中师大教育技术本科，90后年轻老师，擅长用游戏和 iPad 互动工具教学。孩子们都很喜欢他的课堂。",
    "style": "游戏化 · 科技辅助",
    "verified": [
      "实名认证",
      "学历核验"
    ],
    "mode": [
      "线上",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#8b5cf6,#4c1d95)"
  },
  {
    "id": 12,
    "name": "周敏",
    "gender": "女",
    "age": 31,
    "school": "云南师大 · 化学硕士",
    "title": "高中化学专家",
    "subjects": [
      "化学"
    ],
    "primarySubject": "化学",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·化学·必修一",
      "人教·化学·必修二",
      "人教·化学·九上"
    ],
    "tags": [
      "化学实验",
      "高考化学",
      "云师大"
    ],
    "years": 6,
    "students": 90,
    "price": 190,
    "rating": 4.8,
    "reviews": 104,
    "district": "五华区",
    "city": "昆明",
    "bio": "云师大化学硕士，6年高中化学教学。擅长用生活化实验帮学生理解抽象概念。高考化学平均提分20+分。",
    "style": "实验引导 · 概念清晰",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#10B981,#047857)"
  },
  {
    "id": 13,
    "name": "何丽",
    "gender": "女",
    "age": 29,
    "school": "云师大 · 生物学本科",
    "title": "在职初中生物老师",
    "subjects": [
      "生物"
    ],
    "primarySubject": "生物",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·生物·七上",
      "人教·生物·八下",
      "人教·生物·必修一"
    ],
    "tags": [
      "在职教师",
      "生物",
      "会考冲刺"
    ],
    "years": 5,
    "students": 72,
    "price": 160,
    "rating": 4.7,
    "reviews": 86,
    "district": "五华区",
    "city": "昆明",
    "bio": "云师大生物学专业，昆明某重点初中在职教师。擅长会考冲刺，熟悉云南中考生物命题规律。",
    "style": "重点突出 · 考点精讲",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证",
      "在职教师"
    ],
    "mode": [
      "线上",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#14B8A6,#065F46)"
  },
  {
    "id": 14,
    "name": "郑浩",
    "gender": "男",
    "age": 34,
    "school": "云大 · 历史系",
    "title": "历史教师",
    "subjects": [
      "历史"
    ],
    "primarySubject": "历史",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·历史·七上",
      "人教·历史·八下",
      "人教·历史·必修一"
    ],
    "tags": [
      "云大历史",
      "逻辑思维",
      "9年经验"
    ],
    "years": 9,
    "students": 140,
    "price": 170,
    "rating": 4.8,
    "reviews": 118,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "云南大学历史系，9年教学经验。擅长将枯燥历史讲成生动故事，并帮学生建立时间线思维。",
    "style": "故事讲述 · 时间线思维",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#B45309,#78350F)"
  },
  {
    "id": 15,
    "name": "丁薇",
    "gender": "女",
    "age": 25,
    "school": "云艺舞蹈学院",
    "title": "舞蹈老师",
    "subjects": [
      "舞蹈"
    ],
    "primarySubject": "舞蹈",
    "category": "艺术",
    "grades": [
      "小学"
    ],
    "books": [],
    "tags": [
      "民族舞",
      "古典舞",
      "考级",
      "素质教育"
    ],
    "years": 3,
    "students": 35,
    "price": 150,
    "rating": 4.9,
    "reviews": 48,
    "district": "西山区",
    "city": "昆明",
    "bio": "云艺舞蹈学院毕业，擅长中国舞、民族舞、古典舞。有丰富儿童教学经验，带过多名学生参加央视展演。",
    "style": "古典舞蹈 · 身形训练",
    "verified": [
      "实名认证",
      "学历核验",
      "考级评委"
    ],
    "mode": [
      "线下机构",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#EC4899,#9F1239)"
  },
  {
    "id": 16,
    "name": "黄奕",
    "gender": "男",
    "age": 38,
    "school": "云大 · 体育教育硕士",
    "title": "篮球教练",
    "subjects": [
      "体育"
    ],
    "primarySubject": "体育",
    "category": "素质",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [],
    "tags": [
      "篮球",
      "专项训练",
      "校队教练"
    ],
    "years": 12,
    "students": 220,
    "price": 180,
    "rating": 4.9,
    "reviews": 142,
    "district": "呈贡区",
    "city": "昆明",
    "bio": "云大体育教育硕士，曾任昆明某重点中学校队教练。12年青少年篮球教学经验，带过多名学生获省市级奖项。",
    "style": "基本功+战术意识",
    "verified": [
      "实名认证",
      "学历核验",
      "体能教练证"
    ],
    "mode": [
      "户外",
      "线下机构"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#F59E0B,#B45309)"
  },
  {
    "id": 17,
    "name": "林雨",
    "gender": "女",
    "age": 26,
    "school": "云师大 · 英语师范",
    "title": "在职初中英语",
    "subjects": [
      "英语"
    ],
    "primarySubject": "英语",
    "category": "学科",
    "grades": [
      "初中"
    ],
    "books": [
      "人教·英语·七上",
      "人教·英语·八下",
      "人教·英语·九上"
    ],
    "tags": [
      "在职教师",
      "中考冲刺",
      "语法系统"
    ],
    "years": 4,
    "students": 55,
    "price": 160,
    "rating": 4.8,
    "reviews": 78,
    "district": "官渡区",
    "city": "昆明",
    "bio": "云师大英语师范专业，昆明某初中在职英语老师。熟悉云南中考英语，带过的学生中考平均分115+。",
    "style": "语法系统 · 听力训练",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证",
      "在职教师"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#06B6D4,#0E7490)"
  },
  {
    "id": 18,
    "name": "黄思远",
    "gender": "男",
    "age": 27,
    "school": "云南大学 · 物理学硕士",
    "title": "云大物理硕士",
    "subjects": [
      "物理"
    ],
    "primarySubject": "物理",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·物理·八下",
      "人教·物理·九上",
      "人教·物理·必修一"
    ],
    "tags": [
      "竞赛辅导",
      "云大硕士",
      "高考物理"
    ],
    "years": 3,
    "students": 48,
    "price": 200,
    "rating": 4.9,
    "reviews": 65,
    "district": "五华区",
    "city": "昆明",
    "bio": "云南大学物理学硕士，有物理竞赛辅导经验。擅长用实验演示帮学生理解抽象概念。去年指导的3名学生获物理竞赛省二等奖。",
    "style": "实验演示 · 竞赛思维",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#6366F1,#3730A3)"
  },
  {
    "id": 19,
    "name": "周雅芝",
    "gender": "女",
    "age": 24,
    "school": "云南师大 · 英语本科",
    "title": "英语启蒙专家",
    "subjects": [
      "英语"
    ],
    "primarySubject": "英语",
    "category": "学科",
    "grades": [
      "小学"
    ],
    "books": [
      "人教·英语·三上",
      "人教·英语·四上",
      "人教·英语·五上"
    ],
    "tags": [
      "小学英语",
      "自然拼读",
      "启蒙"
    ],
    "years": 2,
    "students": 35,
    "price": 140,
    "rating": 4.8,
    "reviews": 42,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "云师大英语专业本科，专注小学英语启蒙，尤其擅长自然拼读法。让孩子从敢读单词到敢说句子。",
    "style": "自然拼读 · 启蒙导向",
    "verified": [
      "实名认证",
      "学历核验"
    ],
    "mode": [
      "线上",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#A855F7,#6B21A8)"
  },
  {
    "id": 20,
    "name": "吴建华",
    "gender": "男",
    "age": 42,
    "school": "昆明一中 · 在职特级教师",
    "title": "昆一中在职特级",
    "subjects": [
      "数学"
    ],
    "primarySubject": "数学",
    "category": "学科",
    "grades": [
      "高中"
    ],
    "books": [
      "人教·数学·必修一",
      "人教·数学·必修二",
      "人教·数学·选修2-1"
    ],
    "tags": [
      "昆一中",
      "特级教师",
      "高考命题研究"
    ],
    "years": 18,
    "students": 420,
    "price": 280,
    "rating": 5,
    "reviews": 256,
    "district": "五华区",
    "city": "昆明",
    "bio": "昆明一中在职特级教师，18年高中数学教学。参与过云南省高考命题研究。带过的学生高考数学平均分130+。学伴最资深的老师之一。",
    "style": "命题研究 · 考点精讲",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证",
      "特级教师",
      "在职教师"
    ],
    "mode": [
      "上门"
    ],
    "featured": true,
    "color": "linear-gradient(135deg,#DC2626,#7F1D1D)"
  },
  {
    "id": 21,
    "name": "田心",
    "gender": "女",
    "age": 28,
    "school": "中国音乐学院 · 声乐硕士",
    "title": "中国音乐学院硕士",
    "subjects": [
      "声乐"
    ],
    "primarySubject": "声乐",
    "category": "艺术",
    "grades": [
      "小学",
      "初中",
      "高中"
    ],
    "books": [],
    "tags": [
      "美声",
      "民族唱法",
      "艺考辅导"
    ],
    "years": 5,
    "students": 38,
    "price": 280,
    "rating": 4.9,
    "reviews": 52,
    "district": "五华区",
    "city": "昆明",
    "bio": "中国音乐学院声乐硕士，美声+民族。带过多名艺考学生考入中央音乐学院、上海音乐学院。",
    "style": "声乐技巧 · 艺考专项",
    "verified": [
      "实名认证",
      "学历核验",
      "演出履历"
    ],
    "mode": [
      "上门",
      "线下机构"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#F472B6,#9D174D)"
  },
  {
    "id": 22,
    "name": "罗维",
    "gender": "男",
    "age": 33,
    "school": "云南财经大学 · 经济硕士",
    "title": "SAT/托福辅导",
    "subjects": [
      "英语"
    ],
    "primarySubject": "英语",
    "category": "学科",
    "grades": [
      "高中"
    ],
    "books": [],
    "tags": [
      "托福110+",
      "SAT",
      "留学辅导"
    ],
    "years": 7,
    "students": 85,
    "price": 350,
    "rating": 4.9,
    "reviews": 98,
    "district": "盘龙区",
    "city": "昆明",
    "bio": "英国留学归来，托福110+，SAT 1520。专注出国留学英语培训，带过多名学生申请到美国 Top 30 大学。",
    "style": "国际考试 · 应试策略",
    "verified": [
      "实名认证",
      "学历核验",
      "托福证书",
      "SAT证书"
    ],
    "mode": [
      "线上",
      "上门"
    ],
    "featured": true,
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)"
  },
  {
    "id": 23,
    "name": "肖敏",
    "gender": "女",
    "age": 30,
    "school": "云南艺术学院 · 美术教育",
    "title": "美术教师",
    "subjects": [
      "美术"
    ],
    "primarySubject": "美术",
    "category": "艺术",
    "grades": [
      "小学",
      "初中"
    ],
    "books": [],
    "tags": [
      "素描",
      "水彩",
      "儿童创意",
      "云艺"
    ],
    "years": 6,
    "students": 70,
    "price": 160,
    "rating": 4.8,
    "reviews": 73,
    "district": "官渡区",
    "city": "昆明",
    "bio": "云艺美术教育专业，6年青少年美术教学。擅长儿童创意画、素描基础。学员作品多次在省少儿美术展览亮相。",
    "style": "创意激发 · 技法并重",
    "verified": [
      "实名认证",
      "学历核验",
      "教师资格证"
    ],
    "mode": [
      "线下机构",
      "上门"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#FB923C,#C2410C)"
  },
  {
    "id": 24,
    "name": "李然",
    "gender": "男",
    "age": 26,
    "school": "云南民族大学 · 地理学",
    "title": "地理老师",
    "subjects": [
      "地理"
    ],
    "primarySubject": "地理",
    "category": "学科",
    "grades": [
      "初中",
      "高中"
    ],
    "books": [
      "人教·地理·七上",
      "人教·地理·八下",
      "人教·地理·必修一"
    ],
    "tags": [
      "云南地理",
      "地图思维",
      "文综备考"
    ],
    "years": 3,
    "students": 50,
    "price": 150,
    "rating": 4.7,
    "reviews": 58,
    "district": "呈贡区",
    "city": "昆明",
    "bio": "云南民族大学地理学专业。擅长结合云南本地地理讲解课程，让学生通过身边的山川湖泊理解抽象概念。",
    "style": "本地化 · 地图思维",
    "verified": [
      "实名认证",
      "学历核验"
    ],
    "mode": [
      "上门",
      "线上"
    ],
    "featured": false,
    "color": "linear-gradient(135deg,#65A30D,#365314)"
  }
];

const REVIEWS = [
  {
    "tutorId": 1,
    "parent": "王**妈妈",
    "rating": 5,
    "date": "2026-04-10",
    "text": "赵老师讲课非常耐心，孩子作文从二等提到一等，月考进步明显。"
  },
  {
    "tutorId": 1,
    "parent": "李**爸爸",
    "rating": 5,
    "date": "2026-03-28",
    "text": "一级教师的功底就是不一样，孩子以前写作文总是流水账，现在能写出有情节的故事了。"
  },
  {
    "tutorId": 1,
    "parent": "张**妈妈",
    "rating": 5,
    "date": "2026-03-12",
    "text": "10年经验的老师就是稳，每节课都有清晰的目标。强烈推荐。"
  },
  {
    "tutorId": 1,
    "parent": "刘**爸爸",
    "rating": 5,
    "date": "2026-02-20",
    "text": "孩子从抗拒写作文到主动拿起笔，这个变化太宝贵了。"
  },
  {
    "tutorId": 2,
    "parent": "张**妈妈",
    "rating": 5,
    "date": "2026-03-28",
    "text": "李老师讲题很有耐心，孩子这次月考数学从78分提到了92分，非常感谢！"
  },
  {
    "tutorId": 2,
    "parent": "王**爸爸",
    "rating": 5,
    "date": "2026-02-14",
    "text": "沟通顺畅，定价透明，平台不抽成这点很加分。老师真实有水平。"
  },
  {
    "tutorId": 2,
    "parent": "李**妈妈",
    "rating": 5,
    "date": "2026-01-09",
    "text": "备课认真，每次都有针对性的练习。孩子原来不爱数学，现在会主动做题了。"
  },
  {
    "tutorId": 2,
    "parent": "陈**爸爸",
    "rating": 4,
    "date": "2025-12-15",
    "text": "老师专业水平很高，就是有时候课程节奏有点快，需要孩子课后多复习。"
  },
  {
    "tutorId": 3,
    "parent": "刘**妈妈",
    "rating": 5,
    "date": "2026-04-05",
    "text": "王老师英语口语一流，孩子现在愿意开口说英语了，这是最大的进步。"
  },
  {
    "tutorId": 3,
    "parent": "周**爸爸",
    "rating": 5,
    "date": "2026-03-20",
    "text": "雅思8.0的发音真的不一样，孩子的语感明显在提升。"
  },
  {
    "tutorId": 3,
    "parent": "张**妈妈",
    "rating": 4,
    "date": "2026-02-28",
    "text": "上课生动有趣，孩子很期待每次英语课。"
  },
  {
    "tutorId": 4,
    "parent": "陈**爸爸",
    "rating": 5,
    "date": "2026-03-30",
    "text": "高考物理从60提到95分，张老师的题型分类真的有效。"
  },
  {
    "tutorId": 4,
    "parent": "吴**妈妈",
    "rating": 5,
    "date": "2026-03-15",
    "text": "8年的经验就是不一样，对高考规律把握得特别准。"
  },
  {
    "tutorId": 4,
    "parent": "黄**爸爸",
    "rating": 5,
    "date": "2026-02-22",
    "text": "孩子跟张老师一年，从不懂到会做，从会做到会举一反三。"
  },
  {
    "tutorId": 5,
    "parent": "赵**妈妈",
    "rating": 5,
    "date": "2026-04-02",
    "text": "陈老师专业背景深厚，孩子考级一次通过。"
  },
  {
    "tutorId": 5,
    "parent": "孙**爸爸",
    "rating": 5,
    "date": "2026-03-08",
    "text": "从央院来的老师就是不一样，基本功扎实，表现力也到位。"
  },
  {
    "tutorId": 6,
    "parent": "林**妈妈",
    "rating": 5,
    "date": "2026-03-25",
    "text": "刘老师不只教写字，还教做人的道理。孩子明显更沉稳了。"
  },
  {
    "tutorId": 6,
    "parent": "许**妈妈",
    "rating": 4,
    "date": "2026-02-10",
    "text": "12年经验的老师很有耐心，适合基础薄弱的孩子。"
  },
  {
    "tutorId": 7,
    "parent": "高**爸爸",
    "rating": 5,
    "date": "2026-04-08",
    "text": "从华为来的老师，课程设计很有逻辑，孩子学 Python 超快。"
  },
  {
    "tutorId": 7,
    "parent": "郭**妈妈",
    "rating": 5,
    "date": "2026-03-18",
    "text": "孩子信息学竞赛省二等奖，感谢杨老师的耐心指导。"
  },
  {
    "tutorId": 8,
    "parent": "韩**妈妈",
    "rating": 5,
    "date": "2026-03-22",
    "text": "孙老师让孩子爱上了画画，作品越来越有想象力。"
  },
  {
    "tutorId": 9,
    "parent": "方**爸爸",
    "rating": 5,
    "date": "2026-04-01",
    "text": "王老师25年经验，讲题真的透彻。性价比超高。"
  },
  {
    "tutorId": 9,
    "parent": "谭**妈妈",
    "rating": 5,
    "date": "2026-03-05",
    "text": "退休特级教师，基础打得超扎实。孩子小学数学没有问题了。"
  },
  {
    "tutorId": 9,
    "parent": "邓**妈妈",
    "rating": 4,
    "date": "2026-02-18",
    "text": "老师耐心好，价格也亲民，推荐。"
  },
  {
    "tutorId": 10,
    "parent": "马**爸爸",
    "rating": 5,
    "date": "2026-04-05",
    "text": "陈老师教育学出身，懂孩子。沟通非常顺畅。"
  },
  {
    "tutorId": 11,
    "parent": "徐**妈妈",
    "rating": 5,
    "date": "2026-03-30",
    "text": "刘老师很有活力，用 iPad 讲课孩子特别喜欢。"
  },
  {
    "tutorId": 12,
    "parent": "朱**爸爸",
    "rating": 5,
    "date": "2026-03-28",
    "text": "周老师化学讲得生动，用生活例子讲抽象概念。高考+18分！"
  },
  {
    "tutorId": 12,
    "parent": "赖**妈妈",
    "rating": 5,
    "date": "2026-02-20",
    "text": "化学从学渣变学霸，周老师功不可没。"
  },
  {
    "tutorId": 13,
    "parent": "康**妈妈",
    "rating": 5,
    "date": "2026-04-02",
    "text": "何老师是在职教师，最懂考纲。中考生物 A 等级。"
  },
  {
    "tutorId": 14,
    "parent": "汪**爸爸",
    "rating": 5,
    "date": "2026-03-25",
    "text": "郑老师把历史讲得像故事，孩子现在看历史剧都能分析。"
  },
  {
    "tutorId": 14,
    "parent": "万**妈妈",
    "rating": 5,
    "date": "2026-02-15",
    "text": "9年历史教学经验，时间线讲得很清楚。"
  },
  {
    "tutorId": 15,
    "parent": "田**妈妈",
    "rating": 5,
    "date": "2026-03-20",
    "text": "丁老师舞蹈功底扎实，孩子参加央视少儿节目展演拿了奖。"
  },
  {
    "tutorId": 16,
    "parent": "范**爸爸",
    "rating": 5,
    "date": "2026-04-01",
    "text": "黄教练带孩子打球 2 年，进步神速，现在是校队主力。"
  },
  {
    "tutorId": 17,
    "parent": "宋**妈妈",
    "rating": 5,
    "date": "2026-03-15",
    "text": "林老师在职教师，知道考试怎么考。孩子英语听力全对！"
  },
  {
    "tutorId": 20,
    "parent": "沈**爸爸",
    "rating": 5,
    "date": "2026-04-08",
    "text": "昆一中特级教师就是不一样，我家孩子高考数学148分！"
  },
  {
    "tutorId": 20,
    "parent": "廖**妈妈",
    "rating": 5,
    "date": "2026-03-22",
    "text": "吴老师是学伴里最贵的老师，也是最值的老师。高考逆袭的希望。"
  },
  {
    "tutorId": 20,
    "parent": "葛**妈妈",
    "rating": 5,
    "date": "2026-02-28",
    "text": "跟吴老师一年，数学从一般到突出。真心推荐想冲刺名校的孩子。"
  },
  {
    "tutorId": 22,
    "parent": "龚**爸爸",
    "rating": 5,
    "date": "2026-04-05",
    "text": "罗老师帮孩子考到托福108，申请上了UCLA。"
  },
  {
    "tutorId": 22,
    "parent": "孟**妈妈",
    "rating": 5,
    "date": "2026-03-12",
    "text": "SAT 1480分，感谢罗老师的辅导。"
  }
];

const BOOKS = [
  {
    "key": "人教·地理·八下",
    "series": "人教",
    "subject": "地理",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 地理 · 八下",
    "color": "linear-gradient(135deg,#65A30D,#365314)",
    "tutorCount": 1
  },
  {
    "key": "人教·地理·七上",
    "series": "人教",
    "subject": "地理",
    "level": "七上",
    "grade": "初中",
    "title": "人教版 · 地理 · 七上",
    "color": "linear-gradient(135deg,#65A30D,#365314)",
    "tutorCount": 1
  },
  {
    "key": "人教·化学·九上",
    "series": "人教",
    "subject": "化学",
    "level": "九上",
    "grade": "初中",
    "title": "人教版 · 化学 · 九上",
    "color": "linear-gradient(135deg,#10B981,#047857)",
    "tutorCount": 1
  },
  {
    "key": "人教·历史·八下",
    "series": "人教",
    "subject": "历史",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 历史 · 八下",
    "color": "linear-gradient(135deg,#B45309,#78350F)",
    "tutorCount": 1
  },
  {
    "key": "人教·历史·七上",
    "series": "人教",
    "subject": "历史",
    "level": "七上",
    "grade": "初中",
    "title": "人教版 · 历史 · 七上",
    "color": "linear-gradient(135deg,#B45309,#78350F)",
    "tutorCount": 1
  },
  {
    "key": "人教·生物·八下",
    "series": "人教",
    "subject": "生物",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 生物 · 八下",
    "color": "linear-gradient(135deg,#14B8A6,#065F46)",
    "tutorCount": 1
  },
  {
    "key": "人教·生物·七上",
    "series": "人教",
    "subject": "生物",
    "level": "七上",
    "grade": "初中",
    "title": "人教版 · 生物 · 七上",
    "color": "linear-gradient(135deg,#14B8A6,#065F46)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·八下",
    "series": "人教",
    "subject": "数学",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 数学 · 八下",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·九上",
    "series": "人教",
    "subject": "数学",
    "level": "九上",
    "grade": "初中",
    "title": "人教版 · 数学 · 九上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·七上",
    "series": "人教",
    "subject": "数学",
    "level": "七上",
    "grade": "初中",
    "title": "人教版 · 数学 · 七上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 2
  },
  {
    "key": "人教·物理·八下",
    "series": "人教",
    "subject": "物理",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 物理 · 八下",
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)",
    "tutorCount": 1
  },
  {
    "key": "人教·物理·九上",
    "series": "人教",
    "subject": "物理",
    "level": "九上",
    "grade": "初中",
    "title": "人教版 · 物理 · 九上",
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)",
    "tutorCount": 1
  },
  {
    "key": "人教·英语·八下",
    "series": "人教",
    "subject": "英语",
    "level": "八下",
    "grade": "初中",
    "title": "人教版 · 英语 · 八下",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 2
  },
  {
    "key": "人教·英语·九上",
    "series": "人教",
    "subject": "英语",
    "level": "九上",
    "grade": "初中",
    "title": "人教版 · 英语 · 九上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 1
  },
  {
    "key": "人教·英语·七上",
    "series": "人教",
    "subject": "英语",
    "level": "七上",
    "grade": "初中",
    "title": "人教版 · 英语 · 七上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 2
  },
  {
    "key": "人教·地理·必修一",
    "series": "人教",
    "subject": "地理",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 地理 · 必修一",
    "color": "linear-gradient(135deg,#65A30D,#365314)",
    "tutorCount": 1
  },
  {
    "key": "人教·化学·必修二",
    "series": "人教",
    "subject": "化学",
    "level": "必修二",
    "grade": "高中",
    "title": "人教版 · 化学 · 必修二",
    "color": "linear-gradient(135deg,#10B981,#047857)",
    "tutorCount": 1
  },
  {
    "key": "人教·化学·必修一",
    "series": "人教",
    "subject": "化学",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 化学 · 必修一",
    "color": "linear-gradient(135deg,#10B981,#047857)",
    "tutorCount": 1
  },
  {
    "key": "人教·历史·必修一",
    "series": "人教",
    "subject": "历史",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 历史 · 必修一",
    "color": "linear-gradient(135deg,#B45309,#78350F)",
    "tutorCount": 1
  },
  {
    "key": "人教·生物·必修一",
    "series": "人教",
    "subject": "生物",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 生物 · 必修一",
    "color": "linear-gradient(135deg,#14B8A6,#065F46)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·必修二",
    "series": "人教",
    "subject": "数学",
    "level": "必修二",
    "grade": "高中",
    "title": "人教版 · 数学 · 必修二",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 2
  },
  {
    "key": "人教·数学·必修一",
    "series": "人教",
    "subject": "数学",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 数学 · 必修一",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 2
  },
  {
    "key": "人教·数学·选修2-1",
    "series": "人教",
    "subject": "数学",
    "level": "选修2-1",
    "grade": "高中",
    "title": "人教版 · 数学 · 选修2-1",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 1
  },
  {
    "key": "人教·物理·必修二",
    "series": "人教",
    "subject": "物理",
    "level": "必修二",
    "grade": "高中",
    "title": "人教版 · 物理 · 必修二",
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)",
    "tutorCount": 1
  },
  {
    "key": "人教·物理·必修一",
    "series": "人教",
    "subject": "物理",
    "level": "必修一",
    "grade": "高中",
    "title": "人教版 · 物理 · 必修一",
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)",
    "tutorCount": 2
  },
  {
    "key": "人教·物理·选修3-1",
    "series": "人教",
    "subject": "物理",
    "level": "选修3-1",
    "grade": "高中",
    "title": "人教版 · 物理 · 选修3-1",
    "color": "linear-gradient(135deg,#1976D2,#0D47A1)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·六上",
    "series": "人教",
    "subject": "数学",
    "level": "六上",
    "grade": "小学",
    "title": "人教版 · 数学 · 六上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 3
  },
  {
    "key": "人教·数学·三上",
    "series": "人教",
    "subject": "数学",
    "level": "三上",
    "grade": "小学",
    "title": "人教版 · 数学 · 三上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·四上",
    "series": "人教",
    "subject": "数学",
    "level": "四上",
    "grade": "小学",
    "title": "人教版 · 数学 · 四上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 3
  },
  {
    "key": "北师大·数学·四上",
    "series": "北师大",
    "subject": "数学",
    "level": "四上",
    "grade": "小学",
    "title": "北师大版 · 数学 · 四上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 1
  },
  {
    "key": "人教·数学·五上",
    "series": "人教",
    "subject": "数学",
    "level": "五上",
    "grade": "小学",
    "title": "人教版 · 数学 · 五上",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 4
  },
  {
    "key": "人教·数学·五下",
    "series": "人教",
    "subject": "数学",
    "level": "五下",
    "grade": "小学",
    "title": "人教版 · 数学 · 五下",
    "color": "linear-gradient(135deg,#C8102E,#7f1d1d)",
    "tutorCount": 2
  },
  {
    "key": "人教·英语·六上",
    "series": "人教",
    "subject": "英语",
    "level": "六上",
    "grade": "小学",
    "title": "人教版 · 英语 · 六上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 1
  },
  {
    "key": "人教·英语·三上",
    "series": "人教",
    "subject": "英语",
    "level": "三上",
    "grade": "小学",
    "title": "人教版 · 英语 · 三上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 1
  },
  {
    "key": "人教·英语·四上",
    "series": "人教",
    "subject": "英语",
    "level": "四上",
    "grade": "小学",
    "title": "人教版 · 英语 · 四上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 1
  },
  {
    "key": "人教·英语·五上",
    "series": "人教",
    "subject": "英语",
    "level": "五上",
    "grade": "小学",
    "title": "人教版 · 英语 · 五上",
    "color": "linear-gradient(135deg,#2563EB,#1E3A8A)",
    "tutorCount": 2
  },
  {
    "key": "人教·语文·五上",
    "series": "人教",
    "subject": "语文",
    "level": "五上",
    "grade": "小学",
    "title": "人教版 · 语文 · 五上",
    "color": "linear-gradient(135deg,#16a34a,#14532d)",
    "tutorCount": 1
  }
];

const SUBJECTS = [
  "数学",
  "语文",
  "英语",
  "物理",
  "化学",
  "生物",
  "历史",
  "地理",
  "钢琴",
  "书法",
  "美术",
  "舞蹈",
  "编程",
  "体育",
  "声乐"
];
const GRADES = [
  "小学",
  "初中",
  "高中"
];
const DISTRICTS = [
  "五华区",
  "盘龙区",
  "官渡区",
  "西山区",
  "呈贡区"
];
const CATEGORIES = [
  {
    "key": "学科",
    "label": "学科辅导",
    "icon": "📖"
  },
  {
    "key": "艺术",
    "label": "艺术音乐",
    "icon": "🎨"
  },
  {
    "key": "素质",
    "label": "素质教育",
    "icon": "🌱"
  }
];

function getTutorById(id) {
  return TUTORS.find(t => t.id === parseInt(id));
}

function getReviewsForTutor(id) {
  return REVIEWS.filter(r => r.tutorId === parseInt(id));
}

// bookKey can be a full key ("人教·数学·五上") or a prefix ("人教·数学")
function getTutorsByBook(bookKey) {
  return TUTORS.filter(t => t.books && t.books.some(b => b.includes(bookKey)));
}

function getBookByKey(key) {
  return BOOKS.find(b => b.key === key);
}

module.exports = {
  TUTORS,
  REVIEWS,
  BOOKS,
  SUBJECTS,
  GRADES,
  DISTRICTS,
  CATEGORIES,
  getTutorById,
  getReviewsForTutor,
  getTutorsByBook,
  getBookByKey,
  // favorites live in store.js; re-exported for existing pages
  getFavorites: store.getFavorites,
  toggleFavorite: store.toggleFavorite,
  isFavorited: store.isFavorited
};
