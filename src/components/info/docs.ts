import { site } from "@/config/site";
import type { Lang } from "@/i18n/dict";

export interface Doc {
  title: string;
  intro: string;
  sections: { h: string; p: string }[];
}

const EN: Record<string, Doc> = {
  shipping: {
    title: "Shipping & Delivery",
    intro: "Every VELOUR order is shipped fully insured and presented in our signature packaging.",
    sections: [
      { h: "Complimentary worldwide shipping", p: "All orders ship free of charge with full insurance to over 100 countries. Orders are dispatched within 1–2 business days." },
      { h: "Delivery timeframes", p: "Standard delivery arrives within 3–7 business days. Express courier options are arranged on request via our concierge." },
      { h: "Order tracking", p: "A tracking link is issued the moment your parcel leaves our atelier, viewable any time from your account." },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    intro: "Should a piece not be quite right, returns are simple and complimentary within 30 days.",
    sections: [
      { h: "30-day returns", p: "Return unworn items in their original condition and packaging within 30 days for a full refund or exchange." },
      { h: "How to return", p: "Request a prepaid return label from your account or our concierge, and drop your parcel at any partner location." },
      { h: "Exceptions", p: "For hygiene reasons, fragrance and pierced jewelry cannot be returned once opened, unless faulty." },
    ],
  },
  contact: {
    title: "Contact Concierge",
    intro: "Our client care team is available seven days a week to assist with styling, sizing and orders.",
    sections: [
      { h: "WhatsApp", p: `Message us any time at ${site.contact.phoneDisplay} for the fastest, most personal service.` },
      { h: "Email", p: `Write to ${site.contact.email} and we will respond within one business day.` },
      { h: "Hours", p: "Monday to Sunday, 9:00–21:00 (GMT)." },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    intro: "Answers to the questions we hear most often.",
    sections: [
      { h: "Are all items authentic?", p: "Every piece is sourced directly from the maison or an authorised partner and is guaranteed authentic." },
      { h: "How does WhatsApp checkout work?", p: "Add pieces to your bag and choose ‘Order on WhatsApp’. We compose a formatted order you confirm and send to our concierge to finalise payment and delivery." },
      { h: "Do you offer gift wrapping?", p: "All orders arrive beautifully boxed. Add a handwritten note at no charge via the concierge." },
    ],
  },
  about: {
    title: "About VELOUR",
    intro: "VELOUR is an original concept marketplace for modern luxury — a single, considered destination for the world's most coveted houses.",
    sections: [
      { h: "Our philosophy", p: "We believe luxury is the absence of the unnecessary. Everything we present is chosen for craft, longevity and quiet confidence." },
      { h: "The edit", p: "Rather than endless aisles, we curate a focused edit across bags, ready-to-wear, footwear, fragrance, watches and fine jewelry." },
      { h: "Service first", p: "A personal concierge accompanies every client — styling, sizing and sourcing, all a message away." },
    ],
  },
  sustainability: {
    title: "Sustainability",
    intro: "Considered consumption is at the heart of how we operate.",
    sections: [
      { h: "Responsible sourcing", p: "We prioritise houses using recycled metals, responsibly sourced stones and traceable leathers." },
      { h: "Built to last", p: "We champion pieces designed to be repaired, resoled and re-loved — the most sustainable luxury of all." },
      { h: "Mindful packaging", p: "Our packaging is FSC-certified and plastic-free wherever possible." },
    ],
  },
  careers: {
    title: "Careers",
    intro: "We are a small team obsessed with craft, service and detail.",
    sections: [
      { h: "Open roles", p: "We are not actively hiring at this time, but we always welcome exceptional people. Introduce yourself via our concierge." },
      { h: "How we work", p: "Remote-first, design-led, and relentlessly focused on the client experience." },
    ],
  },
  press: {
    title: "Press",
    intro: "For press enquiries, interviews and assets, please get in touch.",
    sections: [
      { h: "Media enquiries", p: `Contact our press office at ${site.contact.email}.` },
      { h: "Brand assets", p: "Logos and approved imagery are available to accredited media on request." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "Your privacy matters. This summary explains how we handle your information.",
    sections: [
      { h: "What we collect", p: "Only what is needed to fulfil your order and improve your experience — contact details, order history and preferences." },
      { h: "How we use it", p: "To process orders, provide service and, with consent, send you previews. We never sell your data." },
      { h: "Your rights", p: "You may request access to, correction of, or deletion of your data at any time via our concierge." },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "These terms govern your use of the VELOUR marketplace.",
    sections: [
      { h: "Orders", p: "Orders placed via WhatsApp are confirmed once availability and payment are arranged with our concierge." },
      { h: "Pricing", p: "Prices are shown in the displayed currency and may change without notice. Taxes and duties may apply at delivery." },
      { h: "Intellectual property", p: "All site content, branding and original imagery are the property of VELOUR." },
    ],
  },
};

const ZH: Record<string, Doc> = {
  shipping: {
    title: "配送与交付",
    intro: "每一笔 VELOUR 订单均全额保价寄出，并以我们标志性的包装呈献。",
    sections: [
      { h: "全球免费配送", p: "所有订单均免费寄送至 100 多个国家，并享全额保价。订单于 1–2 个工作日内发出。" },
      { h: "送达时间", p: "标准配送 3–7 个工作日内送达。可通过礼宾顾问安排加急快递。" },
      { h: "订单追踪", p: "包裹离开工坊即生成追踪链接，可随时在账户中查看。" },
    ],
  },
  returns: {
    title: "退换货",
    intro: "若单品不尽如意，30 天内可享简便、免费的退货。",
    sections: [
      { h: "30 天退货", p: "未穿戴的商品可在 30 天内以原始状态及包装退回，享全额退款或换货。" },
      { h: "如何退货", p: "在账户或通过礼宾顾问申请预付退货标签，并在任意合作网点寄出包裹。" },
      { h: "例外情况", p: "因卫生原因，香氛与穿孔类珠宝一经开封不可退货（质量问题除外）。" },
    ],
  },
  contact: {
    title: "联系礼宾",
    intro: "我们的客户服务团队每周七天为您提供造型、尺码与订单方面的协助。",
    sections: [
      { h: "WhatsApp", p: `随时致信 ${site.contact.phoneDisplay}，获取最快捷、最贴心的服务。` },
      { h: "邮箱", p: `来信至 ${site.contact.email}，我们将于一个工作日内回复。` },
      { h: "服务时间", p: "周一至周日，9:00–21:00（GMT）。" },
    ],
  },
  faq: {
    title: "常见问题",
    intro: "为您解答最常被问到的问题。",
    sections: [
      { h: "所有商品都是正品吗？", p: "每件单品均直接采购自品牌或授权合作方，保证正品。" },
      { h: "WhatsApp 结算如何运作？", p: "将单品加入购物袋并选择「通过 WhatsApp 下单」。我们会生成格式化订单，您确认后发送给礼宾顾问以完成付款与配送。" },
      { h: "提供礼品包装吗？", p: "所有订单均以精美礼盒呈献。可通过礼宾顾问免费添加手写卡片。" },
    ],
  },
  about: {
    title: "关于 VELOUR",
    intro: "VELOUR 是一个面向现代奢华的原创概念集市——汇聚全球最受追捧品牌的考究之地。",
    sections: [
      { h: "我们的理念", p: "我们相信，奢华在于摒弃多余。我们呈献的一切，皆因工艺、耐久与从容的自信而入选。" },
      { h: "精选", p: "我们不做无尽的货架，而是在手袋、成衣、鞋履、香氛、腕表与高级珠宝间精心甄选。" },
      { h: "服务至上", p: "每位客户都有专属礼宾相伴——造型、尺码与寻源，皆一键即达。" },
    ],
  },
  sustainability: {
    title: "可持续发展",
    intro: "审慎的消费是我们经营的核心。",
    sections: [
      { h: "负责任的采购", p: "我们优先选择使用再生金属、负责任采购宝石与可溯源皮革的品牌。" },
      { h: "经久耐用", p: "我们推崇可修复、可换底、可传承的单品——这才是最可持续的奢华。" },
      { h: "用心包装", p: "我们的包装通过 FSC 认证，并尽可能做到无塑料。" },
    ],
  },
  careers: {
    title: "招聘",
    intro: "我们是一支痴迷于工艺、服务与细节的小团队。",
    sections: [
      { h: "在招职位", p: "目前暂无公开招聘，但我们始终欢迎卓越的人才。可通过礼宾顾问做自我介绍。" },
      { h: "我们的工作方式", p: "远程优先、设计驱动，并始终专注于客户体验。" },
    ],
  },
  press: {
    title: "媒体",
    intro: "如有媒体咨询、采访与素材需求，欢迎联系我们。",
    sections: [
      { h: "媒体咨询", p: `请联系我们的媒体办公室：${site.contact.email}。` },
      { h: "品牌素材", p: "标识与经授权的图像可应认证媒体的请求提供。" },
    ],
  },
  privacy: {
    title: "隐私政策",
    intro: "您的隐私至关重要。本摘要说明我们如何处理您的信息。",
    sections: [
      { h: "我们收集什么", p: "仅收集完成订单与改善体验所必需的信息——联系方式、订单历史与偏好。" },
      { h: "我们如何使用", p: "用于处理订单、提供服务，并在获得同意后向您发送预览。我们绝不出售您的数据。" },
      { h: "您的权利", p: "您可随时通过礼宾顾问申请访问、更正或删除您的数据。" },
    ],
  },
  terms: {
    title: "服务条款",
    intro: "本条款规范您对 VELOUR 集市的使用。",
    sections: [
      { h: "订单", p: "通过 WhatsApp 下达的订单，在与礼宾顾问确认库存与付款后即告成立。" },
      { h: "价格", p: "价格以所示货币显示，可能随时变动。配送时可能产生税费与关税。" },
      { h: "知识产权", p: "本站所有内容、品牌标识与原创图像均归 VELOUR 所有。" },
    ],
  },
};

export const infoSlugs = Object.keys(EN);

export function getDoc(slug: string, lang: Lang): Doc | undefined {
  return (lang === "zh" ? ZH[slug] : EN[slug]) ?? EN[slug];
}

export function docTitle(slug: string): string {
  return EN[slug]?.title ?? "Information";
}
