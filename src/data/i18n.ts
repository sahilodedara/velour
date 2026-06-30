import type { Brand, Category, ColorOption, Product } from "./types";
import type { Lang } from "@/i18n/dict";

/** Reusable token map — colors, materials, countries, spec labels and common values. */
const term: Record<string, string> = {
  // colors
  Noir: "黑", Cognac: "干邑棕", Bone: "骨白", Camel: "驼色", Espresso: "浓咖", Slate: "石板灰",
  Burgundy: "勃艮第红", Ivory: "象牙白", Black: "黑色", Navy: "藏青", Forest: "森林绿",
  Tobacco: "烟草棕", Graphite: "石墨灰", Charcoal: "炭灰", Sage: "鼠尾草绿", White: "白色",
  Stone: "石色", Oxblood: "牛血红", Sand: "沙色", "Dark Brown": "深棕", Chocolate: "巧克力棕",
  Taupe: "灰褐", Smoke: "烟灰", Tortoise: "玳瑁",
  "Yellow Gold": "黄金", "White Gold": "白金", "Gold Vermeil": "鎏金银", Silver: "银色",
  "Silver / Steel": "银 / 钢", "Slate / Steel": "石板 / 钢", "Midnight / Steel": "午夜蓝 / 钢",
  "Opaline / Gold": "蛋白 / 金", "Black / Steel": "黑 / 钢", "Black / Cognac": "黑 / 干邑棕",
  "100 ml": "100 毫升",
  // spec labels
  Dimensions: "尺寸", "Strap drop": "肩带垂落", Hardware: "五金", Lining: "内衬", "Made in": "产地",
  Fits: "可容纳", Capacity: "容量", Base: "底部", Construction: "工艺", Last: "鞋楦", Shoulder: "肩部",
  Fabric: "面料", Fit: "版型", Care: "保养", Shell: "外层", Movement: "机芯", "Power reserve": "动力储备",
  "Water resistance": "防水", Case: "表壳", Complication: "复杂功能", Strap: "表带", Metal: "金属",
  Stones: "宝石", Clasp: "搭扣", Face: "戒面", Frame: "镜框", Lens: "镜片", Width: "宽度", Buckle: "带扣",
  Concentration: "浓度", Volume: "容量", Family: "香调", Height: "高度", Upper: "鞋面", Sole: "鞋底",
  Closure: "闭合", Heel: "鞋跟",
  // common values
  France: "法国", Italy: "意大利", Switzerland: "瑞士", England: "英格兰", Portugal: "葡萄牙", Turkey: "土耳其",
  "Full-grain calfskin": "全粒面小牛皮", "Vegetable-tanned saddle leather": "植鞣鞍革",
  "Quilted lambskin": "绗缝羊皮", "Pebbled calfskin": "荔枝纹小牛皮", "Waxed full-grain leather": "上蜡全粒面皮革",
  "Matte calfskin": "哑光小牛皮", "100% double-faced cashmere": "100% 双面羊绒", "Lambskin leather": "羊皮",
  "Sand-washed silk": "砂洗真丝", "Pima cotton": "比马棉", "Virgin wool": "新羊毛", "Calf suede": "小牛麂皮",
  "Box calf leather": "盒装小牛皮", "Waxed suede": "上蜡麂皮", "Eau de Parfum, 100 ml": "浓香水，100 毫升",
  "Stainless steel, sapphire crystal": "不锈钢，蓝宝石水晶", "Stainless steel, aventurine dial": "不锈钢，砂金石表盘",
  "Steel or gold-tone, alligator strap": "钢或金色，鳄鱼皮表带", "Recycled 18k gold": "再生 18K 金",
  "Gold vermeil / sterling silver": "鎏金 / 925 银", "Italian acetate": "意大利醋酸纤维", "Calfskin leather": "小牛皮",
  "Gold-tone brass": "金色黄铜", "Goatskin suede": "山羊麂皮", "Brushed palladium": "拉丝钯金",
  "Gold-tone": "金色", "Brushed gold-tone": "拉丝金色", "Lightweight rubber": "轻质橡胶",
  "Goodyear-welted": "固特异沿条", Almond: "杏仁楦", "Stacked leather": "叠层皮跟", Automatic: "自动上链",
  Moonphase: "月相", Cupro: "铜氨丝", "Eau de Parfum": "浓香水", "Hidden box": "隐藏盒扣",
  "Lever back": "杠杆耳扣", "Gradient, UV400": "渐变，UV400", "Brushed oval": "拉丝椭圆",
};

const tr = (s: string) => term[s] ?? s;

/** Localize a single reusable token (color, material, country…). */
export function localizeTerm(s: string, lang: Lang): string {
  return lang === "zh" ? tr(s) : s;
}

export const zhCategories: Record<string, { name: string; tagline: string }> = {
  bags: { name: "手袋", tagline: "雕塑般的皮具" },
  clothing: { name: "成衣", tagline: "精致成衣" },
  shoes: { name: "鞋履", tagline: "为旅程而制" },
  perfumes: { name: "香氛", tagline: "嗅觉签名" },
  watches: { name: "腕表", tagline: "时间，臻于完美" },
  jewelry: { name: "珠宝", tagline: "可佩戴的光芒" },
  accessories: { name: "配饰", tagline: "点睛之笔" },
  handbags: { name: "手提包", tagline: "" },
  wallets: { name: "钱包", tagline: "" },
  backpacks: { name: "双肩包", tagline: "" },
  travel: { name: "旅行包", tagline: "" },
  jackets: { name: "夹克外套", tagline: "" },
  shirts: { name: "衬衫", tagline: "" },
  tshirts: { name: "T恤", tagline: "" },
  sneakers: { name: "运动鞋", tagline: "" },
  belts: { name: "腰带", tagline: "" },
  sunglasses: { name: "太阳镜", tagline: "" },
};

type CatMap = Record<string, { name: string; tagline?: string }>;

const esCategories: CatMap = {
  bags: { name: "Bolsos", tagline: "Marroquinería escultural" }, clothing: { name: "Ropa", tagline: "Prêt-à-porter, refinado" },
  shoes: { name: "Calzado", tagline: "Hecho para acompañarte" }, perfumes: { name: "Perfumes", tagline: "Firmas olfativas" },
  watches: { name: "Relojes", tagline: "El tiempo, perfeccionado" }, jewelry: { name: "Joyería", tagline: "Luz para llevar" },
  accessories: { name: "Accesorios", tagline: "El toque final" },
  handbags: { name: "Bolsos de mano" }, wallets: { name: "Carteras" }, backpacks: { name: "Mochilas" }, travel: { name: "Bolsos de viaje" },
  jackets: { name: "Chaquetas" }, shirts: { name: "Camisas" }, tshirts: { name: "Camisetas" }, sneakers: { name: "Zapatillas" },
  belts: { name: "Cinturones" }, sunglasses: { name: "Gafas de sol" },
};
const deCategories: CatMap = {
  bags: { name: "Taschen", tagline: "Skulpturale Lederwaren" }, clothing: { name: "Kleidung", tagline: "Prêt-à-porter, veredelt" },
  shoes: { name: "Schuhe", tagline: "Gemacht, um Sie zu tragen" }, perfumes: { name: "Düfte", tagline: "Olfaktorische Signaturen" },
  watches: { name: "Uhren", tagline: "Zeit, perfektioniert" }, jewelry: { name: "Schmuck", tagline: "Licht zum Tragen" },
  accessories: { name: "Accessoires", tagline: "Der letzte Schliff" },
  handbags: { name: "Handtaschen" }, wallets: { name: "Geldbörsen" }, backpacks: { name: "Rucksäcke" }, travel: { name: "Reisetaschen" },
  jackets: { name: "Jacken" }, shirts: { name: "Hemden" }, tshirts: { name: "T-Shirts" }, sneakers: { name: "Sneaker" },
  belts: { name: "Gürtel" }, sunglasses: { name: "Sonnenbrillen" },
};
const koCategories: CatMap = {
  bags: { name: "가방", tagline: "조각 같은 가죽 제품" }, clothing: { name: "의류", tagline: "정제된 기성복" },
  shoes: { name: "신발", tagline: "당신과 함께할 신발" }, perfumes: { name: "향수", tagline: "후각의 시그니처" },
  watches: { name: "시계", tagline: "완벽해진 시간" }, jewelry: { name: "주얼리", tagline: "착용하는 빛" },
  accessories: { name: "액세서리", tagline: "마무리의 한 끗" },
  handbags: { name: "핸드백" }, wallets: { name: "지갑" }, backpacks: { name: "백팩" }, travel: { name: "여행 가방" },
  jackets: { name: "재킷" }, shirts: { name: "셔츠" }, tshirts: { name: "티셔츠" }, sneakers: { name: "스니커즈" },
  belts: { name: "벨트" }, sunglasses: { name: "선글라스" },
};
const frCategories: CatMap = {
  bags: { name: "Sacs", tagline: "Maroquinerie sculpturale" }, clothing: { name: "Prêt-à-porter", tagline: "Le vestiaire, raffiné" },
  shoes: { name: "Chaussures", tagline: "Faites pour vous accompagner" }, perfumes: { name: "Parfums", tagline: "Signatures olfactives" },
  watches: { name: "Montres", tagline: "Le temps, perfectionné" }, jewelry: { name: "Joaillerie", tagline: "La lumière à porter" },
  accessories: { name: "Accessoires", tagline: "La touche finale" },
  handbags: { name: "Sacs à main" }, wallets: { name: "Portefeuilles" }, backpacks: { name: "Sacs à dos" }, travel: { name: "Sacs de voyage" },
  jackets: { name: "Vestes" }, shirts: { name: "Chemises" }, tshirts: { name: "T-shirts" }, sneakers: { name: "Sneakers" },
  belts: { name: "Ceintures" }, sunglasses: { name: "Lunettes de soleil" },
};

const CAT_BY_LANG: Partial<Record<Lang, CatMap>> = {
  zh: zhCategories, es: esCategories, de: deCategories, ko: koCategories, fr: frCategories,
};

export const zhBrands: Record<string, string> = {
  solene: "巴黎皮具品牌，以雕塑般的手柄包与手工修饰的小牛皮闻名。",
  castellane: "纯粹的米兰裁缝艺术——羊绒大衣与剪裁无可挑剔的西装。",
  orvieto: "独立的瑞士风格制表，搭载自制机芯，低调而精准。",
  lunaire: "现代小众香水屋，将稀有原精调配成夜色般难忘的尾调。",
  belmonte: "在小型工坊手工制作的鞋履——固特异沿条皮革与轻盈鞋底。",
  vesper: "以再生黄金与负责任采购的宝石呈现的高级珠宝。",
  marchetti: "采用建筑感醋酸纤维与抛光五金的配饰与眼镜。",
  "saint-aubin": "外套专家——防水皮革与适合旅行的剪裁。",
};

/** Per-product Chinese copy (short + long). Names/SKUs stay original. */
export const zhProducts: Record<string, { short: string; desc: string }> = {
  "p-001": { short: "雕塑般的手柄包，采用手工修饰小牛皮与鎏金搭扣。", desc: "品牌的标志性轮廓，由整张全粒面小牛皮裁制并全程手工完成。轻微立体的包身历经多年使用仍能保持形状，标志性的鎏金搭扣以珠宝盒般的清脆声响闭合。麂皮内衬，配可拆卸肩带。" },
  "p-002": { short: "建筑感日用托特包，鞍革材质，磁吸闭合。", desc: "为考究通勤而设计，结构托特包在大容量与简洁的建筑线条间取得平衡。鞍革经植鞣处理，随佩戴愈发醇厚；内置拉链袋与笔电隔层让随身物品井然有序。" },
  "p-003": { short: "菱格绗缝羊皮，配纤细链条与皮革肩带。", desc: "以柔软的菱格绗缝羊皮呈现的晚间必备。链条与皮革交织的肩带可对折单肩背或斜挎长背。" },
  "p-004": { short: "荔枝纹皮革对折钱包，八个卡位。", desc: "极简而精准，对折钱包采用荔枝纹小牛皮裁制并手工封边。八个卡位与一个全宽钞票夹层保持纤薄轮廓。" },
  "p-005": { short: "防水皮革旅行包，专为长周末而制。", desc: "为旅行而生，旅行包将上蜡全粒面皮革与防泼水帆布底部相结合。宽大开口可平摊便于收纳；可拆卸肩带带衬垫，便于行进。" },
  "p-006": { short: "极简哑光皮革双肩包，磁吸翻盖。", desc: "简洁线条与隐藏式磁吸翻盖定义了都市双肩包。带衬垫肩带与专属数码隔层使其兼具实用与低调。" },
  "p-007": { short: "双面羊绒大衣，简洁戗驳领。", desc: "品牌标志：剪裁利落、从肩部垂直垂落的双面羊绒大衣。无衬里、手工修饰，以轻盈之姿垂坠，却不失保暖。" },
  "p-008": { short: "不对称机车夹克，柔软如手套的羊皮。", desc: "对机车夹克的现代演绎，以柔软如手套的羊皮贴身剪裁，配不对称拉链与同色五金。全衬里，于针织衫外利落垂落。" },
  "p-009": { short: "飘逸砂洗真丝衬衫，配贝母纽扣。", desc: "砂洗真丝赋予这款衬衫哑光、流动的触感。版型剪裁随性垂坠，配宽松衣领与真正的贝母纽扣。" },
  "p-010": { short: "日常奢享 T 恤，厚磅比马棉。", desc: "看似简单，这款 T 恤以长绒比马棉织造，质感紧密顺滑，圆领历经多次水洗仍能保持版型。" },
  "p-011": { short: "半麻衬西装外套，那不勒斯软肩。", desc: "半麻衬结构与柔软的那不勒斯肩部赋予这款羊毛西装外套随性、如第二层肌肤般的触感。贴袋设计令其随性到足以搭配牛仔裤。" },
  "p-012": { short: "手工修饰麂皮跑鞋，轻盈鞋底。", desc: "低帮跑鞋，采用柔润麂皮，手工修饰并搭配轻质橡胶底与皮革包边中底。低调奢华，百搭耐穿。" },
  "p-013": { short: "固特异沿条德比鞋，盒装小牛皮。", desc: "百搭德比鞋，采用抛光盒装小牛皮，固特异沿条工艺，经久耐用且可换底。杏仁鞋楦让线条在西装或牛仔裤下都显优雅。" },
  "p-014": { short: "利落切尔西靴，上蜡麂皮配松紧侧拼。", desc: "贴合脚踝、线条简洁的切尔西靴，采用上蜡麂皮，配双侧松紧拼条与皮革拉环。叠层皮跟完成整体线条。" },
  "p-015": { short: "夜色浓香水，皮革、沉香与黑李。", desc: "Noir Absolu 以黑李与藏红花开篇，随后沉淀于皮革、沉香与香草原精的基调。为夜晚而调的深邃、绵长尾调。" },
  "p-016": { short: "烟熏沉香裹以玫瑰与琥珀。", desc: "Oud Royale 在大马士革玫瑰与温暖琥珀之上层叠烟熏沉香木——丰盈、树脂感十足，令人无法忽视。" },
  "p-017": { short: "明亮白花之上轻覆柔和麝香。", desc: "Fleur Blanche 是一束由晚香玉、茉莉与橙花组成的明亮花香，以洁净、贴肤的麝香作底。" },
  "p-018": { short: "39 毫米自动上链表，银色玑镂表盘。", desc: "自动天文台表搭载自制机芯，以每小时 28,800 次摆频在银色玑镂表盘后跳动。39 毫米钢壳与蓝宝石水晶令其低调而精准。" },
  "p-019": { short: "月相复杂功能，深蓝砂金石表盘。", desc: "缀满星光的砂金石表盘衬托精准的月相复杂功能。Moonphase 39 是制表工艺的静默宣言。" },
  "p-020": { short: "超薄正装表，配鳄鱼皮表带。", desc: "厚度仅 7 毫米，Heritage Slim 可轻松滑入任何袖口。漆面乳白表盘、柳叶指针与手工缝制鳄鱼皮表带成就正装表的理想。" },
  "p-021": { short: "再生 18K 金密镶网球手链。", desc: "一条由明亮式切割宝石连成的连续线条，镶嵌于再生 18K 金中。隐藏式盒扣令手链在腕间无缝相连。" },
  "p-022": { short: "经典印章戒，拉丝再生鎏金银。", desc: "现代印章戒，配拉丝椭圆戒面，可直接佩戴或镌刻。以再生鎏金覆于 925 银之上铸造。" },
  "p-023": { short: "垂坠耳环，悬于黄金耳扣之下。", desc: "切面宝石自纤细的黄金耳扣折射光芒，随每个举手投足轻柔摆动。配舒适的杠杆耳扣。" },
  "p-024": { short: "雕塑感醋酸纤维太阳镜，渐变镜片。", desc: "手工抛光的意大利醋酸纤维镜框搭配具备全面防紫外线的渐变镜片。永恒的轮廓，适合大多数脸型。" },
  "p-025": { short: "双面皮革腰带，配拉丝金色带扣。", desc: "二合一腰带：一面光滑黑色，另一面干邑棕，由可旋转的拉丝金色带扣连接。" },
};

export interface LocalizedProduct {
  name: string;
  shortDescription: string;
  description: string;
  material: string;
  colors: ColorOption[];
  specs: { label: string; value: string }[];
}

export function localizeProduct(p: Product, lang: Lang): LocalizedProduct {
  // Product prose is translated for Chinese only; other languages fall back to English.
  if (lang !== "zh") {
    return {
      name: p.name, shortDescription: p.shortDescription, description: p.description,
      material: p.material, colors: p.colors, specs: p.specs,
    };
  }
  const zh = zhProducts[p.id];
  return {
    name: p.name, // house product names stay in their original (latin) form
    shortDescription: zh?.short ?? p.shortDescription,
    description: zh?.desc ?? p.description,
    material: tr(p.material),
    colors: p.colors.map((c) => ({ ...c, name: tr(c.name) })),
    specs: p.specs.map((s) => ({ label: tr(s.label), value: tr(s.value) })),
  };
}

export function localizeCategory(c: Category, lang: Lang): { name: string; tagline: string } {
  const m = CAT_BY_LANG[lang];
  if (!m) return { name: c.name, tagline: c.tagline ?? "" };
  const e = m[c.slug];
  return { name: e?.name ?? c.name, tagline: e?.tagline ?? c.tagline ?? "" };
}

export function localizeCategoryName(slug: string, fallback: string, lang: Lang): string {
  return CAT_BY_LANG[lang]?.[slug]?.name ?? fallback;
}

export function localizeBrandDesc(slug: string, fallback: string, lang: Lang): string {
  if (lang !== "zh") return fallback;
  return zhBrands[slug] ?? fallback;
}
