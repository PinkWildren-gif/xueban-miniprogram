// utils/data.js — shared tutor database (port of demo3-xueban/data.js)

const TUTORS = [
  {
    id: 1, name: "赵娟", gender: "女", age: 35,
    school: "云南师范大学 · 汉语言文学",
    title: "在职一级教师",
    subjects: ["数学", "语文"], primarySubject: "数学",
    category: "学科",
    grades: ["小学"],
    books: ["人教·数学·五上", "人教·数学·五下", "人教·数学·六上", "人教·数学·四上", "人教·语文·五上"],
    tags: ["人教版精通", "一级教师", "8年经验", "作文专项"],
    years: 10, students: 200,
    price: 160, rating: 5.0, reviews: 210,
    district: "西山区", city: "昆明",
    bio: "云师大汉语言文学专业，10年小学语文和数学教学经验。在职一级教师。擅长阅读与作文，学生作文多次在省市级比赛获奖。",
    style: "情景教学 · 循序渐进",
    verified: ["实名认证", "学历核验", "教师资格证", "一级教师"],
    mode: ["上门", "线上"],
    featured: true,
    color: "#16a34a"
  },
  {
    id: 2, name: "李明", gender: "男", age: 28,
    school: "云南师范大学 · 数学研究生",
    title: "数学研究生",
    subjects: ["数学"], primarySubject: "数学",
    category: "学科",
    grades: ["初中", "高中"],
    books: ["人教·数学·七上", "人教·数学·八下", "人教·数学·九上", "人教·数学·必修一"],
    tags: ["中考冲刺", "高考冲刺", "思维导图", "云师大"],
    years: 5, students: 80,
    price: 180, rating: 4.9, reviews: 127,
    district: "五华区", city: "昆明",
    bio: "云南师范大学数学专业研究生，5年一线教学经验。擅长用思维导图帮助学生建立知识体系。",
    style: "思维引导型 · 因材施教",
    verified: ["实名认证", "学历核验", "教师资格证"],
    mode: ["上门", "线上"],
    featured: true,
    color: "#C8102E"
  },
  {
    id: 3, name: "王芳", gender: "女", age: 26,
    school: "云南大学 · 外国语学院",
    title: "云大英语 · 雅思8.0",
    subjects: ["英语"], primarySubject: "英语",
    category: "学科",
    grades: ["小学", "初中"],
    books: ["人教·英语·五上", "人教·英语·六上", "人教·英语·七上"],
    tags: ["雅思8.0", "沉浸式口语", "兴趣导向", "云大"],
    years: 3, students: 60,
    price: 150, rating: 4.8, reviews: 98,
    district: "盘龙区", city: "昆明",
    bio: "云南大学英语专业，雅思8.0。擅长小初衔接，让孩子从'哑巴英语'转为敢说敢用。",
    style: "沉浸式口语 · 兴趣导向",
    verified: ["实名认证", "学历核验", "雅思证书"],
    mode: ["上门", "线上"],
    featured: false,
    color: "#E91E63"
  },
  {
    id: 4, name: "张伟", gender: "男", age: 32,
    school: "昆明理工大学 · 物理系",
    title: "昆工物理硕士",
    subjects: ["物理"], primarySubject: "物理",
    category: "学科",
    grades: ["高中"],
    books: ["人教·物理·必修一", "人教·物理·必修二"],
    tags: ["高考物理", "命题规律", "题型分类"],
    years: 8, students: 150,
    price: 220, rating: 4.9, reviews: 156,
    district: "呈贡区", city: "昆明",
    bio: "昆工物理系硕士，8年高中物理教学经验。深谙云南高考物理命题规律。",
    style: "题型分类 · 高考专项",
    verified: ["实名认证", "学历核验", "教师资格证"],
    mode: ["上门", "线上"],
    featured: true,
    color: "#1976D2"
  },
  {
    id: 5, name: "陈刚", gender: "男", age: 30,
    school: "中央音乐学院 · 钢琴系",
    title: "央院钢琴硕士",
    subjects: ["钢琴"], primarySubject: "钢琴",
    category: "艺术",
    grades: ["小学", "初中"],
    books: [],
    tags: ["央院硕士", "考级辅导", "古典钢琴"],
    years: 6, students: 45,
    price: 300, rating: 4.9, reviews: 87,
    district: "五华区", city: "昆明",
    bio: "中央音乐学院钢琴演奏硕士毕业，回昆明发展6年。带出多名央院、上音附中考生。",
    style: "古典系统 · 严谨扎实",
    verified: ["实名认证", "学历核验", "演出履历"],
    mode: ["上门"],
    featured: false,
    color: "#5E35B1"
  },
  {
    id: 6, name: "王磊", gender: "男", age: 58,
    school: "云南民族大学 · 退休数学教师",
    title: "退休特级教师",
    subjects: ["数学"], primarySubject: "数学",
    category: "学科",
    grades: ["小学", "初中"],
    books: ["人教·数学·五上", "人教·数学·五下", "人教·数学·六上"],
    tags: ["25年教龄", "特级教师", "经验丰富", "价格亲民"],
    years: 25, students: 350,
    price: 120, rating: 4.8, reviews: 167,
    district: "盘龙区", city: "昆明",
    bio: "云南民族大学附中退休数学教师，25年一线教学经验。擅长打好小学数学基础。",
    style: "循循善诱 · 基础扎实",
    verified: ["实名认证", "学历核验", "特级教师"],
    mode: ["上门"],
    featured: false,
    color: "#ea580c"
  },
  {
    id: 7, name: "杨帆", gender: "男", age: 29,
    school: "昆明理工 · 计算机硕士",
    title: "前华为工程师",
    subjects: ["编程"], primarySubject: "编程",
    category: "素质",
    grades: ["小学", "初中"],
    books: [],
    tags: ["少儿Python", "Scratch", "信息学奥赛"],
    years: 4, students: 55,
    price: 200, rating: 4.9, reviews: 72,
    district: "呈贡区", city: "昆明",
    bio: "昆工计算机硕士，华为前端工程师，专注少儿编程教育。",
    style: "项目驱动 · 兴趣养成",
    verified: ["实名认证", "学历核验", "大厂背景"],
    mode: ["线上", "上门"],
    featured: false,
    color: "#00897B"
  },
  {
    id: 8, name: "吴建华", gender: "男", age: 42,
    school: "昆明一中 · 在职特级教师",
    title: "昆一中特级教师",
    subjects: ["数学"], primarySubject: "数学",
    category: "学科",
    grades: ["高中"],
    books: ["人教·数学·必修一", "人教·数学·必修二"],
    tags: ["昆一中", "特级教师", "高考命题研究"],
    years: 18, students: 420,
    price: 280, rating: 5.0, reviews: 256,
    district: "五华区", city: "昆明",
    bio: "昆明一中在职特级教师，18年高中数学教学。参与过云南省高考命题研究。",
    style: "命题研究 · 考点精讲",
    verified: ["实名认证", "学历核验", "特级教师", "在职教师"],
    mode: ["上门"],
    featured: true,
    color: "#DC2626"
  }
];

const SUBJECTS = ["数学", "语文", "英语", "物理", "化学", "钢琴", "书法", "美术", "编程", "体育"];
const GRADES = ["小学", "初中", "高中"];
const DISTRICTS = ["五华区", "盘龙区", "官渡区", "西山区", "呈贡区"];

// Helpers
function getTutorById(id) {
  return TUTORS.find(t => t.id === parseInt(id));
}

function getFavorites() {
  return wx.getStorageSync('favorites') || [];
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  wx.setStorageSync('favorites', favs);
  return favs.includes(id);
}

function isFavorited(id) {
  return getFavorites().includes(id);
}

module.exports = {
  TUTORS,
  SUBJECTS,
  GRADES,
  DISTRICTS,
  getTutorById,
  getFavorites,
  toggleFavorite,
  isFavorited
};
