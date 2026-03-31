import React, { useState } from 'react';
import { Button, Input, Upload, Typography, Table, Modal, Row, Col, Divider, message, Card, Popconfirm, Select, Dropdown } from 'antd';
import { 
  UploadOutlined, MenuOutlined, FormatPainterOutlined, HighlightOutlined, ExportOutlined,
  MinusCircleFilled, SearchOutlined, RightOutlined, DownOutlined, SyncOutlined,
  CopyOutlined, EditOutlined, DownloadOutlined, DoubleRightOutlined, PictureOutlined, PlusOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Dragger } = Upload;

// --- 静态数据区 ---
const mockTableData=[{key:'1',name:'【德国进口】电动剃须刀男士官方正品2026畅销第一便携式刮胡刀送男友',id:'ID : 849163492773',img:'/selection_1.jpg',sales:69,monthSales:43,score1:'基础分 75分',score2:'扶优分 未覆盖',baseScore:75,time:'2026-01-17 14:31',timestamp:1768631460000},{key:'2',name:'古堡月光下的誓言适用iPhone17promax手机壳磁吸16promax保护15pro...',id:'ID : 676431797446',img:'/selection_2.jpg',sales:26,monthSales:21,score1:'基础分 100分',score2:'扶优分 70分',baseScore:100,time:'2026-01-23 15:54',timestamp:1769154840000},{key:'3',name:'SmoSmos【千禧Boxing7.0】原创气质时髦25秋冬复古职场女包腋下包',id:'ID : 982138402112',img:'/selection_3.jpg',sales:26,monthSales:21,score1:'基础分 87分',score2:'扶优分 未覆盖',baseScore:87,time:'2026-01-10 09:35',timestamp:1768008900000}];
const mockMainImages=['/main_1.jpg','/main_2.jpg','/main_3.jpg','/main_4.jpg','/main_5.jpg'];
const mockDetailImages=['/detail_1.jpg','/detail_2.jpg','/detail_3.jpg','/detail_4.jpg','/detail_5.jpg'];
const optimizeImageData=[{id:'1',title:'图 1',oldImg:'/main_1.jpg',newImg:'/optimized_1.png',reason:'解决问题：促销牛皮癣占比过高 (>60%)，严重遮挡商品主体，影响点击转化。'},{id:'2',title:'图 2',oldImg:'/main_2.jpg',newImg:'/optimized_2.png',reason:'解决问题：画面右下角检测到高危违禁词 (“No.1”) 及疑似伪造的奖杯认证，存在被职业打假与平台处罚风险。'},{id:'3',title:'图 3',oldImg:'/main_3.jpg',newImg:'/optimized_3.png',reason:'解决问题：图文包含“彻底颠覆”、“超跑级”等无法证实的主观极限用语，不符合电商法规范。'},{id:'5',title:'图 5',oldImg:'/main_5.jpg',newImg:'/optimized_5.png',reason:'解决问题：包含“红肿痘痘脸”等引人生理不适的画面，且涉嫌拉踩竞品，极易引发消费者投诉与平台屏蔽。'},{id:'add',title:'全局规范',oldImg:null,newImg:'/optimized_add_1.png',reason:'解决问题：未检测到 800×800px 的纯白底商品展示图，已为您自动生成。'}];
const optimizeDetailImageData=[{id:'detail_1',title:'图 1',oldImg:'/detail_1.jpg',newImg:'/optimized_6.jpg',reason:'解决问题：删除了“国家补贴”、“额度告急”等制造焦虑的敏感词，并替换了存在侵权风险的明星肖像。'},{id:'detail_2',title:'图 2',oldImg:'/detail_2.jpg',newImg:'/optimized_7.jpg',reason:'解决问题：全面清除了“领先者”、“热销第一”、“TOP1”等极易触发高额罚款的广告法严打词汇。'},{id:'detail_4',title:'图 4',oldImg:'/detail_4.jpg',newImg:'/optimized_8.jpg',reason:'解决问题：替换了“实力碾压”等涉嫌恶意贬低、拉踩竞品的违规对比用语，符合平台良性竞争规范。'},{id:'detail_5',title:'图 5',oldImg:'/detail_5.jpg',newImg:'/optimized_9.jpg',reason:'解决问题：去除了极易引发违背承诺投诉的图片端服务文案，并删除了“领先行业”绝对化违规词。'}];
const categoryData={level1:[{id:'1',name:'个人洗护清洁用具'},{id:'2',name:'家务/地板清洁用具'},{id:'3',name:'男士理容工具'},{id:'4',name:'卫浴/置物用具'}],level2:{'1':[{id:'1-1',name:'牙膏/牙线'},{id:'1-2',name:'洗发水'},{id:'1-3',name:'沐浴露'}],'2':[{id:'2-1',name:'拖把/扫把'},{id:'2-2',name:'垃圾桶'},{id:'2-3',name:'清洁剂'}],'3':[{id:'3-1',name:'剃须刀'},{id:'3-2',name:'剃须刀架'},{id:'3-3',name:'剃须刀片'},{id:'3-4',name:'剃须刀清洁刷'}],'4':[{id:'4-1',name:'毛巾架'},{id:'4-2',name:'马桶刷'},{id:'4-3',name:'防滑垫'}]},level3:{'1-1':[{id:'1-1-1',name:'黑人'},{id:'1-1-2',name:'云南白药'},{id:'1-1-99',name:'其他',isOther:true}],'1-2':[{id:'1-2-1',name:'海飞丝'},{id:'1-2-2',name:'潘婷'},{id:'1-2-99',name:'其他',isOther:true}],'1-3':[{id:'1-3-1',name:'舒肤佳'},{id:'1-3-2',name:'多芬'},{id:'1-3-99',name:'其他',isOther:true}],'2-1':[{id:'2-1-1',name:'美丽雅'},{id:'2-1-2',name:'妙洁'},{id:'2-1-99',name:'其他',isOther:true}],'2-2':[{id:'2-2-1',name:'茶花'},{id:'2-2-2',name:'振兴'},{id:'2-2-99',name:'其他',isOther:true}],'2-3':[{id:'2-3-1',name:'威猛先生'},{id:'2-3-2',name:'蓝月亮'},{id:'2-3-99',name:'其他',isOther:true}],'3-1':[{id:'3-1-1',name:'BIC/比克'},{id:'3-1-2',name:'Boncho/斑彩'},{id:'3-1-3',name:'CARZOR'},{id:'3-1-4',name:'CODOL'},{id:'3-1-5',name:'Damall/大猫'},{id:'3-1-6',name:'EASTWINNIE/东方维黎'},{id:'3-1-7',name:'EMEER/易美尔'},{id:'3-1-8',name:'HTC/卷直发器'},{id:'3-1-9',name:'Hin Beauty/欣丽美'},{id:'3-1-99',name:'其他',isOther:true}],'3-2':[{id:'3-2-1',name:'吉列'},{id:'3-2-2',name:'舒适'},{id:'3-2-99',name:'其他',isOther:true}],'3-3':[{id:'3-3-1',name:'飞利浦'},{id:'3-3-2',name:'博朗'},{id:'3-3-99',name:'其他',isOther:true}],'3-4':[{id:'3-4-1',name:'松下'},{id:'3-4-2',name:'飞科'},{id:'3-4-99',name:'其他',isOther:true}],'4-1':[{id:'4-1-1',name:'九牧'},{id:'4-1-2',name:'潜水艇'},{id:'4-1-99',name:'其他',isOther:true}],'4-2':[{id:'4-2-1',name:'佳帮手'},{id:'4-2-2',name:'宜洁'},{id:'4-2-99',name:'其他',isOther:true}],'4-3':[{id:'4-3-1',name:'大卫'},{id:'4-3-2',name:'双庆'},{id:'4-3-99',name:'其他',isOther:true}]}};
const p2MainPrompts=["深邃科技黑背景，剃须刀以45度角悬浮展示，机身屏幕亮起清晰的数字电量。背景带有微弱的蓝色AI光晕和高级金属光泽，画面极简大气，视觉重心突出“德国进口”与“AI智能屏显”的高端质感。","极微距镜头特写剃须刀顶部的6刀头与刀网。使用冷色调轮廓光打在金属表面，展现出刀网极其精致的孔洞与锋利感。画面隐喻“0.041mm超薄马氏体刀网”与“585.9mm² 大面积”的精工制造水准。","剃须刀机身带有科技感的半透视发光效果或周围环绕着动感的蓝色能量波纹。用视觉化的风暴或气流特效，表现内部“3引擎”的澎湃动力，同时传达“372万次急速切割”且“低噪音”的平顺剃须体验。","阳光充足的高级灰色调现代洗漱台，或高档商务旅行皮包旁边。剃须刀安静地放置在台面上，旁边搭配一根精致的Type-C数据线。营造出从容自信的早晨或差旅氛围。体现“40分钟快充，60天长续航”的极致便利。","纯白背景（#FFFFFF），剃须刀正面居中、无死角高清展示。光线均匀柔和，无任何多余背景、文字、阴影或反光杂乱。"];
const p2GeneratedMainImgs=['/p1.jpg', '/p2.jpg', '/p3.jpg', '/p4.jpg', '/p5.jpg'];
const p2DetailPrRaw = [{t:"海报级头图（定调与震撼）",d:"全屏科技深灰背景，巨大的6刀头局部特写占据核心。旁悬发光“德国精工”与“AI 智能”字眼。"},{t:"核心卖点全览（提纲领）",d:"剃须刀机身完整展示，周围引出6个科技感的信息框（或发光节点），分别指向刀头、刀网、引擎、芯片、屏幕和充电口。"},{t:"刀头/刀网解析（性能深挖1）",d:"微距级别的3D爆炸图，清晰拆解出外部的0.041mm超薄刀网和内部的6刀头组件，旁边配以胡须被瞬间切断的模拟动画或微距对比图。"},{t:"动力引擎解析（性能深挖2）",d:"X光透视效果展示机身内部的“3引擎”，周围带有蓝色的风暴气流或声波扩散纹理。"},{t:"AI智能控压（黑科技展示）",d:"真人面部轮廓（下颌角）特写，带有蓝色网格扫描线。剃须刀刀头完美贴合曲线，展示出动态的弧度调节感。"},{t:"充电与续航（消除焦虑）",d:"日历背景（翻过60页）叠加上闪电图标。旁边是Type-C接口插拔的特写镜头。"},{t:"适用场景与人群（情感代入）",d:"分为两部分。上半部分是精英男士在高级酒店洗漱台前从容理容；下半部分是精美的礼盒包装，旁边放着贺卡或缎带。"},{t:"品质背书与服务（临门一脚）",d:"展示“德国进口”的相关证明或质检图标（必须合规，不能用刚才那些违法的山寨奖杯），加上顺丰包邮、防伪溯源的官方图标。"}];
const p2GeneratedDetailImgs = ['/p_1.jpg', '/p_2.jpg', '/p_3.jpg', '/p_4.jpg', '/p_5.jpg', '/p_6.jpg', '/p_7.jpg', '/p_8.jpg'];

// --- UI 小组件 ---
const AttrField = ({ label, value, placeholder, options, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
    <span style={{ fontSize: 13, color: '#000', width: 90, textAlign: 'right', marginRight: 12 }}>{label}</span>
    {options ? (
      <Select value={value} onChange={onChange} placeholder={<span style={{ fontSize: 11, color: '#bfbfbf' }}>{placeholder}</span>} style={{ flex: 1, height: 32 }} dropdownStyle={{ zIndex: 9999 }} suffixIcon={<DownOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />}>
        {options.map(opt => <Select.Option key={opt} value={opt}><span style={{fontSize: 11}}>{opt}</span></Select.Option>)}
      </Select>
    ) : (
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ flex: 1, fontSize: 11, height: 32 }} />
    )}
  </div>
);

const SectionTitle = ({ children }) => <div style={{ marginBottom: 16, textAlign: 'left' }}><Text strong style={{ fontSize: 16, color: '#000' }}>{children}</Text></div>;

const AddPromptCard = ({ num }) => (
  <div style={{ display: 'flex', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', height: 120, position: 'relative', backgroundColor: '#fff' }}>
    <div style={{ position: 'absolute', top: 4, left: 4, background: '#c2d6f9', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 11, zIndex: 2, fontWeight: 'bold' }}>{num}</div>
    <div style={{ width: 100, background: '#f0f5ff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #e8e8e8' }}>
      <PlusOutlined style={{ fontSize: 28, color: '#888' }} />
    </div>
    <div style={{ flex: 1, padding: '12px 24px 12px 12px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1, backgroundColor: '#f5f5f5', height: 40, borderRadius: 6 }}></div>
      <EditOutlined style={{ fontSize: 22, color: '#666', cursor: 'pointer' }} onClick={() => message.warning('暂未开放此模块~')} title="输入提示词" />
    </div>
  </div>
);

const PromptCard = ({ num, title, desc, imgSrc, onPreview }) => (
  <div style={{ display: 'flex', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', height: 120, position: 'relative' }}>
    <div style={{ position: 'absolute', top: 4, left: 4, background: '#a1c4fd', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 10, zIndex: 2 }}>{num}</div>
    <div style={{ width: 100, background: '#f0f5ff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #e8e8e8', overflow: 'hidden' }}>
      {imgSrc ? (
        <img src={imgSrc} alt="generated" style={{width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in'}} onClick={() => onPreview(imgSrc)} />
      ) : (
        <PictureOutlined style={{ fontSize: 24, color: '#a1c4fd' }} />
      )}
    </div>
    <div style={{ flex: 1, padding: '12px 24px 12px 12px', position: 'relative', backgroundColor: '#fff' }}>
      {title && <div style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4, color: '#333' }}>{title}</div>}
      <div style={{ fontSize: 10, color: '#666', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: title ? 3 : 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</div>
      <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 8 }}>
        {imgSrc && (
           <Popconfirm title="确认要重新生成这张图片吗？" onConfirm={() => message.success('已加入重新生成队列')} okText="确定" cancelText="取消">
             <SyncOutlined style={{ color: '#999', cursor: 'pointer' }} title="重新生成" />
           </Popconfirm>
        )}
        <EditOutlined style={{ color: '#999', cursor: 'pointer' }} onClick={() => message.warning('暂未开放此模块~')} title="重新写提示词" />
      </div>
    </div>
  </div>
);

// --- 主组件 ---
export default function App() {
  const [activeMenu, setActiveMenu] = useState('1'); 
  const [linkValue, setLinkValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [mainImgs, setMainImgs] = useState([]);
  const [detailImgs, setDetailImgs] = useState([]);
  const [attrFilled, setAttrFilled] = useState(false); 
  const [isTested, setIsTested] = useState(false); 
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(['1']);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [activeL1, setActiveL1] = useState('3'); 
  const [activeL2, setActiveL2] = useState('3-1'); 
  const [activeL3, setActiveL3] = useState('');
  const [finalCategoryPath, setFinalCategoryPath] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('其他');
  const [attrValues, setAttrValues] = useState({});
  const [isImageOptModalVisible, setIsImageOptModalVisible] = useState(false); 
  const [isDetailOptModalVisible, setIsDetailOptModalVisible] = useState(false); 
  const [newProductImages, setNewProductImages] = useState([]);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [isMainImgGenerated, setIsMainImgGenerated] = useState(false); 
  const [isDetailImgGenerated, setIsDetailImgGenerated] = useState(false); 
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  
  // 状态：用于存储 AI 返回的数据
  const [titleOptData, setTitleOptData] = useState([]);
  const [diagnosisText, setDiagnosisText] = useState('');

  // --- 核心逻辑：对接 Python 后端的异步请求函数 ---
  const handleTest = async () => {
    if (!titleValue.trim()) return message.warning("请输入标题后再检测");

    // 开启加载提示 [cite: 95]
    const hide = message.loading('AI 正在诊断优化中...', 0);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/optimize_title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: titleValue, 
          category: finalCategoryPath || "男士理容" 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 更新 AI 返回的 3 条标题建议和优化逻辑 [cite: 47]
        setTitleOptData(data.optimized_suggestions); 
        // 更新顶部的诊断结果文字 [cite: 35, 36]
        setDiagnosisText(data.diagnosis_result); 
        setIsTested(true);
        message.success('诊断完成');
      } else {
        throw new Error(data.error || '后端接口返回错误');
      }
    } catch (error) {
      console.error(error);
      message.error("连接 AI 服务失败，请检查后端 app.py 是否已正常启动");
    } finally {
      hide(); // 关闭加载提示
    }
  };

  const userMenu = {
    items: [{ key: 'switch', label: '店铺切换' }, { key: 'logout', label: '退出账号' }],
    onClick: () => message.warning('暂未开放此模块~')
  };

  const hasAnyData = titleValue.trim() !== '' || mainImgs.length > 0 || detailImgs.length > 0 || attrFilled;
  const handlePreview = (src) => { setPreviewImageSrc(src); setPreviewVisible(true); };

  const fillAllMockData = () => {
    setTitleValue('【德国进口】电动剃须刀男士官方正品2026畅销第一便携式刮胡刀送男友');
    setMainImgs(mockMainImages); setDetailImgs(mockDetailImages); setAttrFilled(true);
    setFinalCategoryPath("家庭/个人清洁工具 >> 男士理容工具 >> 剃须刀 >> 其他");
    setSelectedBrand("其他");
    setAttrValues({ blades: '6刀头', packaging: '基础包装', power: 'Type-C接口充电', isBulk: '否', scene: '通用' });
    setIsTested(false);
  };

  const handleAttrChange = (key, val) => {
    if (key === 'isBulk' && val === '是') return message.warning('暂未开放此模块~');
    setAttrValues(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setLinkValue(''); setTitleValue(''); setMainImgs([]); setDetailImgs([]); setAttrFilled(false);
    setFinalCategoryPath(''); setSelectedBrand('其他'); setAttrValues({}); setIsTested(false); setSelectedRowKeys([]); 
    setTitleOptData([]); setDiagnosisText('');
  };

  const handleImportClick = () => { if (linkValue.trim() !== '') fillAllMockData(); };
  const handleNewProductUpload = () => {
    setNewProductImages(['/raw_1.jpg']);
    setNewProductDesc('德国进口剃须刀，6刀头、0.041mm刀网、3引擎低噪音、3720000次切割、高硬度马氏体刀网、585.9mm^2有效剃须面积、AI智能控制剃须弧度、充电快typeC40min充满可以用60天。');
  };

  const getSelectedPathName = () => {
    const l1Name = categoryData.level1.find(item => item.id === activeL1)?.name || '';
    const l2Name = categoryData.level2[activeL1]?.find(item => item.id === activeL2)?.name || '';
    const l3Name = categoryData.level3[activeL2]?.find(item => item.id === activeL3)?.name || '';
    return [l1Name, l2Name, l3Name].filter(Boolean).join(' > ');
  };

  const isCategoryConfirmDisabled = !(activeL1 === '3' && activeL2 === '3-1' && activeL3 !== '');
  const handleL3Click = (item) => { setActiveL3(item.id); if (activeL1 !== '3' || activeL2 !== '3-1') message.warning('暂未开放此模块~'); };

  const onProductSelectChange = (newSelectedRowKeys) => {
    let nextKeys = [];
    if (newSelectedRowKeys.length > 0) {
      const newlyAdded = newSelectedRowKeys.find(k => !selectedRowKeys.includes(k));
      if (newlyAdded) nextKeys = [newlyAdded]; 
    }
    setSelectedRowKeys(nextKeys);
    if (nextKeys.includes('2') || nextKeys.includes('3')) message.warning('暂未开放此模块~');
  };
  const handleProductModalOk = () => { if (selectedRowKeys.includes('1')) { fillAllMockData(); setIsProductModalVisible(false); } };

  const handleDownloadImage = (imgUrl, id) => {
    const link = document.createElement('a'); link.href = imgUrl; link.download = `optimized_${id}.png`; 
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleSaveAllImages = (data, setModalVisible) => {
    data.forEach(item => { if (item.newImg) handleDownloadImage(item.newImg, item.id); });
    message.success('已开始下载全部图片'); setModalVisible(false);
  };

  const renderOptModal = (title, visible, setVisible, data) => (
    <Modal title={<span style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</span>} open={visible} onCancel={() => setVisible(false)} width={1100} centered footer={[<Button key="submit" type="primary" shape="round" size="large" onClick={() => handleSaveAllImages(data, setVisible)} style={{ backgroundColor: '#2f54eb' }}>一键保存</Button>]}>
      <div style={{ maxHeight: '600px', overflowY: 'auto', paddingTop: 16, paddingBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col span={8} key={item.id}>
              <Card styles={{ body: { padding: '16px 12px' } }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 12 }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  {item.oldImg ? (
                    <div style={{ width: '42%', borderRadius: 4, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                      <img src={item.oldImg} alt="原图" style={{ width: '100%', display: 'block', cursor: 'zoom-in' }} onClick={() => handlePreview(item.oldImg)} />
                    </div>
                  ) : (<div style={{ width: '42%', height: '100px', backgroundColor: '#fafafa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text type="secondary" style={{fontSize: 12}}>无原图</Text></div>)}
                  <DoubleRightOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                  <div style={{ width: '42%', borderRadius: 4, border: '2px solid #2f54eb', overflow: 'hidden' }}>
                    <img src={item.newImg} alt="优化图" style={{ width: '100%', display: 'block', cursor: 'zoom-in' }} onClick={() => handlePreview(item.newImg)} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#888', flex: 1, marginBottom: 16, lineHeight: '1.5' }}>{item.reason}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                  <EditOutlined style={{ fontSize: 15, color: '#888', cursor: 'pointer' }} onClick={() => message.warning('暂未开放此模块~')} title="重新写提示词" />
                  <Popconfirm title="确认要重新生成这张图片吗？" onConfirm={() => message.success('已加入重新生成队列')} okText="确定" cancelText="取消"><SyncOutlined style={{ fontSize: 15, color: '#888', cursor: 'pointer' }} title="重新生成" /></Popconfirm>
                  <CopyOutlined style={{ fontSize: 15, color: '#888', cursor: 'pointer' }} onClick={() => message.success('已复制图片')} title="复制图片" />
                  <DownloadOutlined style={{ fontSize: 15, color: '#888', cursor: 'pointer' }} onClick={() => handleDownloadImage(item.newImg, item.id)} title="下载图片" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );

  const columns = [
    { title: '名称', dataIndex: 'name', width: 300, render: (text, record) => (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <img src={record.img} alt="cover" style={{ width: 60, height: 60, borderRadius: 4, objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => handlePreview(record.img)} />
          <div><div style={{ fontSize: 13, lineHeight: '18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{text}</div><div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{record.id}</div></div>
        </div>
      )},
    { title: '累计销量 ⇅', dataIndex: 'sales', align: 'center', sorter: (a, b) => a.sales - b.sales },
    { title: '30日销量 ⇅', dataIndex: 'monthSales', align: 'center', sorter: (a, b) => a.monthSales - b.monthSales },
    { title: '质量分 ⇅', key: 'score', sorter: (a, b) => a.baseScore - b.baseScore, render: (_, record) => (<div style={{ fontSize: 12 }}><div style={{ color: '#52c41a' }}>• {record.score1}</div><div style={{ color: '#52c41a' }}>• {record.score2}</div></div>) },
    { title: '上架时间 ⇅', dataIndex: 'time', align: 'center', sorter: (a, b) => a.timestamp - b.timestamp, render: (t) => <span style={{ fontSize: 12, color: '#666' }}>{t}</span> }
  ];

  const renderImageRow = (images) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '16px', backgroundColor: '#f8faff', borderRadius: '8px', border: '1px solid #cde0ff' }}>
      {images.map((url, idx) => (
        <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 4, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
          <img src={url} alt={`img-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => handlePreview(url)} />
          <MinusCircleFilled style={{ position: 'absolute', top: 4, right: 4, color: '#ff4d4f', fontSize: 16, cursor: 'pointer', background: '#fff', borderRadius: '50%', zIndex: 2 }} onClick={(e) => { e.stopPropagation(); message.warning('暂未开放此模块~'); }} />
        </div>
      ))}
      <Upload showUploadList={false} beforeUpload={() => false}>
        <div style={{ width: 80, height: 80, borderRadius: 4, border: '1px dashed #d9d9d9', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fafafa' }}>
          <UploadOutlined style={{ fontSize: 18, color: '#999' }} />
          <span style={{ fontSize: 10, color: '#999', marginTop: 4, textAlign: 'center', padding: '0 4px' }}>点击继续上传</span>
        </div>
      </Upload>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f0f2f5', fontFamily: 'PingFang SC, sans-serif', overflow: 'hidden' }}>
      <div style={{ width: '90px', backgroundColor: '#eef3fc', borderRight: '1px solid #dce3f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', zIndex: 10 }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormatPainterOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: '0 8px' }}>
          <div onClick={() => setActiveMenu('1')} style={{ backgroundColor: activeMenu === '1' ? '#dce5f5' : 'transparent', borderRadius: '20px', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: activeMenu === '1' ? '1px solid #c5d4eb' : '1px solid transparent' }}>
            <ExportOutlined style={{ fontSize: 16, color: activeMenu === '1' ? '#333' : '#666' }} />
            <span style={{ fontSize: '11px', marginTop: 4, color: activeMenu === '1' ? '#333' : '#666', fontWeight: activeMenu === '1' ? 'bold' : 'normal' }}>存量商品优化</span>
          </div>
          <div onClick={() => setActiveMenu('2')} style={{ backgroundColor: activeMenu === '2' ? '#dce5f5' : 'transparent', borderRadius: '20px', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: activeMenu === '2' ? '1px solid #c5d4eb' : '1px solid transparent' }}>
            <UploadOutlined style={{ fontSize: 16, color: activeMenu === '2' ? '#333' : '#666' }} />
            <span style={{ fontSize: '11px', marginTop: 4, color: activeMenu === '2' ? '#333' : '#666', fontWeight: activeMenu === '2' ? 'bold' : 'normal' }}>新品极速上线</span>
          </div>
        </div>
        <Dropdown menu={userMenu} placement="topLeft" trigger={['click']}>
          <div style={{ marginTop: 'auto', padding: 8, cursor: 'pointer' }}>
            <MenuOutlined style={{ fontSize: 20, color: '#333' }} />
          </div>
        </Dropdown>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5' }}>
        <div style={{ height: '48px', backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 24px' }}>
          <Text strong style={{ fontSize: '14px', color: '#333' }}>当前店铺：Kaito服装旗舰店</Text>
        </div>

        <div style={{ flex: 1, display: 'flex', padding: '16px 24px 24px 24px', gap: '24px', overflow: 'hidden' }}>
          {activeMenu === '1' ? (
            <>
              <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
                <div style={{ padding: '32px 32px 80px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Button type="primary" shape="round" onClick={() => setIsProductModalVisible(true)} style={{ backgroundColor: '#2f54eb', width: '120px' }}>选择已有商品</Button>
                    <div style={{ display: 'flex', flex: 1, backgroundColor: '#f5f5f5', borderRadius: '20px', padding: '2px 2px 2px 16px' }}>
                      <Input placeholder="或输入商品链接......" variant="borderless" value={linkValue} onChange={e => setLinkValue(e.target.value)} onPressEnter={handleImportClick} style={{ backgroundColor: 'transparent', boxShadow: 'none' }} />
                      <Button shape="round" onClick={handleImportClick} style={{ border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>导入</Button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginBottom: '32px' }}><Text style={{ fontSize: '12px', color: '#999' }}>皆可直接导入标题、商品主图、商品详情页图片、商品属性</Text></div>
                  <div style={{ marginBottom: '24px' }}>
                    <SectionTitle>标题检测</SectionTitle>
                    <Input placeholder="请输入商品标题......" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', color: titleValue ? '#333' : undefined, fontSize: 13, fontWeight: titleValue ? 'bold' : 'normal' }} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <SectionTitle>商品主图</SectionTitle>
                    {mainImgs.length === 0 ? (
                      <Dragger beforeUpload={() => { setMainImgs(mockMainImages); return false; }} style={{ backgroundColor: '#f8faff', borderColor: '#cde0ff', borderRadius: '8px', padding: '24px 0' }}>
                        <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 24, color: '#666' }} /></p>
                        <p className="ant-upload-text" style={{ fontSize: '13px' }}>请点击上传商品主图或将主图拖动至此</p>
                      </Dragger>
                    ) : ( renderImageRow(mainImgs) )}
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <SectionTitle>详情页图片</SectionTitle>
                    {detailImgs.length === 0 ? (
                      <Dragger beforeUpload={() => { setDetailImgs(mockDetailImages); return false; }} style={{ backgroundColor: '#f8faff', borderColor: '#cde0ff', borderRadius: '8px', padding: '24px 0' }}>
                        <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 24, color: '#666' }} /></p>
                        <p className="ant-upload-text" style={{ fontSize: '13px' }}>请点击上传商品详情页图片或将详情页拖动至此</p>
                      </Dragger>
                    ) : ( renderImageRow(detailImgs) )}
                  </div>
                  <div>
                    <SectionTitle>属性诊断</SectionTitle>
                    {!attrFilled ? (
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px', height: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 16, color: '#000', width: 90, textAlign: 'right', marginRight: 12 }}>商品类目：</span>
                          <div onClick={() => setIsCategoryModalVisible(true)} style={{ width: '250px', border: '1px solid #d9d9d9', borderRadius: 4, padding: '4px 11px', cursor: 'pointer', color: '#bfbfbf' }}>请选择</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '24px 12px 24px 24px', backgroundColor: '#fafafa' }}>
                        <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                            <span style={{ fontSize: 16, color: '#000', width: 90, textAlign: 'right', marginRight: 12 }}>商品类目：</span>
                            <div onClick={() => setIsCategoryModalVisible(true)} style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: 4, padding: '4px 11px', cursor: 'pointer', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 13, color: '#000' }}>{finalCategoryPath || "家庭/个人清洁工具 >> 男士理容工具 >> 剃须刀 >> 其他"}</span><DownOutlined style={{ fontSize: 10, color: '#bfbfbf' }} />
                            </div>
                          </div>
                          <div style={{ display: 'flex', marginBottom: 12 }}>
                            <span style={{ fontSize: 16, color: '#000', width: 90, textAlign: 'right', marginRight: 12, paddingTop: 4 }}>重要属性：</span>
                            <div style={{ flex: 1 }}>
                              <Row gutter={24}>
                                <Col span={12}><AttrField label="品牌" value={selectedBrand} onChange={e => setSelectedBrand(e)} /></Col>
                                <Col span={12}><AttrField label="刀头数量" value={attrValues.blades} onChange={val => handleAttrChange('blades', val)} /></Col>
                                <Col span={12}><AttrField label="包装种类" options={['基础包装', '礼盒装', '环保装']} value={attrValues.packaging} onChange={val => handleAttrChange('packaging', val)} /></Col>
                                <Col span={12}><AttrField label="电源方式" value={attrValues.power} onChange={val => handleAttrChange('power', val)} /></Col>
                                <Col span={12}><AttrField label="是否量贩装" options={['是', '否']} value={attrValues.isBulk} onChange={val => handleAttrChange('isBulk', val)} /></Col>
                                <Col span={12}><AttrField label="适用场景" options={['通用', '旅行', '送礼']} value={attrValues.scene} onChange={val => handleAttrChange('scene', val)} /></Col>
                              </Row>
                            </div>
                          </div>
                          <Divider dashed style={{ margin: '12px 0 24px 0', borderColor: '#d9d9d9' }} />
                          <div style={{ display: 'flex' }}>
                            <span style={{ fontSize: 16, color: '#000', width: 90, textAlign: 'right', marginRight: 12, paddingTop: 4 }}>其他属性：</span>
                            <div style={{ flex: 1 }}>
                              <Row gutter={24}>
                                <Col span={12}><AttrField label="是否有修剪器" placeholder="请选择" options={['有', '无']} value={attrValues.trimmer} onChange={val => handleAttrChange('trimmer', val)} /></Col>
                                <Col span={12}><AttrField label="货号" placeholder="请输入" value={attrValues.itemNo} onChange={val => handleAttrChange('itemNo', val)} /></Col>
                                <Col span={12}><AttrField label="商品类型" placeholder="请选择" options={['往复式', '旋转式', '便携式']} value={attrValues.type} onChange={val => handleAttrChange('type', val)} /></Col>
                                <Col span={12}><AttrField label="电压" placeholder="请选择" options={['220V', '110-240V通用']} value={attrValues.voltage} onChange={val => handleAttrChange('voltage', val)} /></Col>
                                <Col span={12}><AttrField label="价格区间" placeholder="请选择" options={['0-100元', '100-300元', '300-500元', '500元以上']} value={attrValues.priceRange} onChange={val => handleAttrChange('priceRange', val)} /></Col>
                                <Col span={12}><AttrField label="充电时间" placeholder="请选择" options={['1小时', '2小时', '8小时']} value={attrValues.chargeTime} onChange={val => handleAttrChange('chargeTime', val)} /></Col>
                                <Col span={12}><AttrField label="款式" placeholder="请选择" options={['便携迷你款', '标准家用款']} value={attrValues.style} onChange={val => handleAttrChange('style', val)} /></Col>
                                <Col span={12}><AttrField label="使用时间" placeholder="请选择" options={['30分钟', '45分钟', '60分钟', '90分钟及以上']} value={attrValues.useTime} onChange={val => handleAttrChange('useTime', val)} /></Col>
                                <Col span={12}><AttrField label="清洗类型" placeholder="请选择" options={['全身水洗', '刀头水洗', '不可水洗']} value={attrValues.cleaning} onChange={val => handleAttrChange('cleaning', val)} /></Col>
                                <Col span={12}><AttrField label="售后服务" placeholder="请选择" options={['全国联保', '店铺保修']} value={attrValues.afterSales} onChange={val => handleAttrChange('afterSales', val)} /></Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 32px', backgroundColor: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 8px 8px', zIndex: 10 }}>
                  {hasAnyData && (<Button type="primary" shape="round" onClick={handleReset} style={{ backgroundColor: '#2f54eb', width: '80px' }}>重置</Button>)}
                  <Button type="primary" shape="round" disabled={!titleValue} onClick={handleTest} style={{ backgroundColor: !titleValue ? undefined : '#2f54eb', width: '80px' }}>检测</Button>
                </div>
              </div>
              {!isTested ? (
                <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                   <HighlightOutlined style={{ fontSize: '64px', color: '#bfbfbf', marginBottom: '24px', transform: 'rotate(-45deg)' }} />
                   <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>请在左侧选择、导入或填写商品信息，点击检测获取 AI 优化建议</Text>
                </div>
              ) : (
                <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px 24px', overflowY: 'auto' }}>
                  {titleValue.trim() !== '' && (
                    <div style={{ marginBottom: 40, textAlign: 'left' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>标题诊断结果</div>
                      <div style={{ border: '1px solid #d9d9d9', padding: '8px 12px', borderRadius: 4, backgroundColor: '#fafafa', fontSize: 13, color: '#333', marginBottom: 16 }}>{diagnosisText || "暂无诊断数据"}</div>
                      <div style={{ marginLeft: 24 }}>
                        <div style={{ fontSize: 13, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>标题优化建议</div>
                        <Row gutter={16}>
                          {titleOptData.map((item, idx) => (
                            <Col span={8} key={idx}>
                              <Card styles={{ body: { padding: 12, textAlign: 'left' } }} style={{ height: '100%' }}>
                                <div style={{ fontSize: 13, color: '#333', marginBottom: 12, minHeight: 60 }}>{item.t}</div>
                                <div style={{ display: 'flex', gap: 12, marginBottom: 12, justifyContent: 'flex-end' }}>
                                  {/* ✨ 重点：这里的 SyncOutlined 绑定了 handleTest 函数实现点击重新生成 [cite: 47] */}
                                  <Popconfirm title="确认要重新生成推荐文案吗？" onConfirm={handleTest} okText="确定" cancelText="取消">
                                    <SyncOutlined style={{ color: '#999', cursor: 'pointer' }} title="重新生成" />
                                  </Popconfirm>
                                  <CopyOutlined style={{ color: '#999', cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(item.t); message.success('已复制文字'); }} />
                                </div>
                                <div style={{ fontSize: 11, color: '#999', lineHeight: '1.5' }}>{item.r}</div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  )}
                  {mainImgs.length > 0 && (
                    <div style={{ marginBottom: 40, textAlign: 'left' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>主图诊断结果</div>
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: 16, fontSize: 13, lineHeight: '24px', color: '#333', backgroundColor: '#fafafa', maxHeight: '160px', overflowY: 'auto', marginBottom: 12 }}>
                        • 图1诊断 (占比超标)：促销牛皮癣占比过高 (&gt;60%)，严重遮挡商品主体，影响点击转化。<br/>
                        • 图2诊断 (违规标识)：画面右下角检测到高危违禁词 (“No.1”) 及疑似伪造的奖杯认证，存在被职业打假与平台处罚风险。<br/>
                        • 图3诊断 (极限词汇)：图文包含“彻底颠覆”、“超跑级”等无法证实的主观极限用语，不符合电商法规范。<br/>
                        • 图5诊断 (视觉违规)：包含“红肿痘痘脸”等引人生理不适的画面，且涉嫌拉踩竞品，极易引发消费者投诉与平台屏蔽。<br/>
                        • 全局规范 (严重缺失)：未检测到 800×800px 的纯白底商品展示图。
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Button type="primary" shape="round" size="small" onClick={() => setIsImageOptModalVisible(true)} style={{ backgroundColor: '#2f54eb' }}>优化图片</Button>
                      </div>
                    </div>
                  )}
                  {detailImgs.length > 0 && (
                    <div style={{ marginBottom: 40, textAlign: 'left' }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>详情图诊断结果</div>
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: 16, fontSize: 13, lineHeight: '24px', color: '#333', backgroundColor: '#fafafa', maxHeight: '160px', overflowY: 'auto', marginBottom: 12 }}>
                        • 图1诊断（敏感词与焦虑营销）：滥用“国家补贴”、“额度告急”、“速抢”等字眼，涉嫌虚构稀缺性制造消费者焦虑；且包含明星肖像，需核实是否有明确的授权文件，否则存在肖像权投诉风险。<br/>
                        • 图2诊断（恶劣违禁词）：满屏皆是广告法严打词汇：“领先者”、“热销第一”、“霸榜”、“重新定义”及巨大化的“TOP1”。一经系统排查或举报，单条即可触发高额罚款。<br/>
                        • 图3诊断（违规引流与造假风险）：拼接淘宝官方“天猫榜单”UI 界面并大肆宣扬“TOP1”。若无最新且权威的数据公证书支撑，属于典型的“虚假宣传”。<br/>
                        • 图4诊断（违规对比用语）：文案使用“实力碾压”，涉嫌恶意贬低、拉踩同行业竞品，违反平台良性竞争规范。<br/>
                        • 图5诊断（物流与服务违规承诺）：“顺丰包邮”及“郑重承诺”等售后保障若未在系统服务标中勾选仅在图片中展示，属于“服务承诺不一致”，易引发违背承诺投诉；且“领先行业”涉绝对化违规。
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Button type="primary" shape="round" size="small" onClick={() => setIsDetailOptModalVisible(true)} style={{ backgroundColor: '#2f54eb' }}>优化图片</Button>
                      </div>
                    </div>
                  )}
                  {attrFilled && (
                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 }}>属性诊断结果</div>
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: 16, backgroundColor: '#fafafa' }}>
                        <div style={{ fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                          重要属性 - 是否量贩装 : 否 <span style={{ color: '#52c41a' }}>→ 是</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#999', lineHeight: '1.5' }}>
                          优化逻辑：检测到您的标题包含“送礼/礼盒”，且详情图中包含多个配件与精美包装，系统推断属于套装/量贩属性。修改为“是”可大幅提升在“送礼”、“套装”等精准长尾词下的搜索展现权重。
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* --- 页面 2：新品极速上线 --- */}
              <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>上传商品图片<span style={{ color: '#ff4d4f' }}>*</span></div>
                    <div style={{ fontSize: '12px', color: '#888' }}>* 上传多张不同角度的商品图片效果更佳</div>
                  </div>
                  {newProductImages.length === 0 ? (
                    <Dragger beforeUpload={() => { handleNewProductUpload(); return false; }} style={{ backgroundColor: '#f8faff', borderColor: '#cde0ff', borderRadius: '8px', padding: '40px 0', marginBottom: '24px' }}>
                      <p className="ant-upload-drag-icon"><PictureOutlined style={{ fontSize: 32, color: '#666' }} /></p>
                      <p className="ant-upload-text" style={{ fontSize: '14px', color: '#333' }}>请点击 <UploadOutlined /> 上传商品图片或将图片拖动至此</p>
                      <p className="ant-upload-hint" style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>允许上传JPG、JPEG、PNG格式，上限10张，单张大小不超过3MB。<br/>尺寸建议大于800x800px，长宽不超过4000px</p>
                    </Dragger>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '16px', backgroundColor: '#f8faff', borderRadius: '8px', border: '1px solid #cde0ff', marginBottom: '24px' }}>
                      {newProductImages.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 4, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                          <img src={url} alt="上传图" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} onClick={() => handlePreview(url)} />
                          <MinusCircleFilled style={{ position: 'absolute', top: 4, right: 4, color: '#ff4d4f', fontSize: 16, cursor: 'pointer', background: '#fff', borderRadius: '50%', zIndex: 2 }} onClick={(e) => { e.stopPropagation(); message.warning('暂未开放此模块~'); }} />
                        </div>
                      ))}
                      <Upload showUploadList={false} beforeUpload={() => false}>
                        <div style={{ width: 80, height: 80, borderRadius: 4, border: '1px dashed #d9d9d9', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fafafa' }}>
                          <UploadOutlined style={{ fontSize: 18, color: '#999' }} />
                          <span style={{ fontSize: 10, color: '#999', marginTop: 4, textAlign: 'center', padding: '0 4px' }}>点击继续上传</span>
                        </div>
                      </Upload>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
                    <Input placeholder="输入商品描述，可以包含参数、优点、特点等......" variant="borderless" value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: '24px', height: '40px', fontSize: 13, paddingLeft: 16 }} />
                    <Button shape="round" disabled={newProductImages.length === 0} onClick={() => setIsAnalyzing(true)} style={{ height: '40px', width: '80px', backgroundColor: newProductImages.length === 0 ? '#f5f5f5' : '#2f54eb', borderColor: newProductImages.length === 0 ? '#d9d9d9' : '#2f54eb', color: newProductImages.length === 0 ? '#bfbfbf' : '#fff', fontWeight: 'bold' }}>分析</Button>
                  </div>
                  {isAnalyzing && (
                    <div>
                      {/* ✨ 左侧仅保留生成主图板块 */}
                      <SectionTitle>生成主图</SectionTitle>
                      <Row gutter={[16, 16]}>
                        {p2MainPrompts.map((desc, idx) => (
                          <Col span={12} key={idx}>
                            <PromptCard num={idx+1} desc={desc} imgSrc={isMainImgGenerated ? p2GeneratedMainImgs[idx] : null} onPreview={handlePreview} />
                          </Col>
                        ))}
                        <Col span={12}><AddPromptCard num={6} /></Col>
                      </Row>
                      <div style={{ textAlign: 'right', marginTop: 16, marginBottom: 40 }}>
                        {!isMainImgGenerated ? (
                          <Button type="primary" shape="round" style={{ backgroundColor: '#2f54eb' }} onClick={() => setIsMainImgGenerated(true)}>确认生成</Button>
                        ) : (
                          <Button type="primary" shape="round" style={{ backgroundColor: '#2f54eb' }} onClick={() => { p2GeneratedMainImgs.forEach((url, i) => handleDownloadImage(url, `p${i+1}`)); message.success('已开始批量下载生成的图片'); }}>下载</Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* --- 右侧展示区：负责生成标题与详情图 --- */}
              <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {!isAnalyzing ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                     <HighlightOutlined style={{ fontSize: '64px', color: '#bfbfbf', marginBottom: '24px', transform: 'rotate(-45deg)' }} />
                     <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>请在左侧上传商品图片，点击分析获取 AI 生成规划</Text>
                  </div>
                ) : (
                  <div style={{ padding: '32px 24px', overflowY: 'auto' }}>
                    <SectionTitle>生成标题</SectionTitle>
                    <Row gutter={16} style={{ marginBottom: 40 }}>
                      {titleOptData.map((item, idx) => (
                        <Col span={8} key={idx}>
                          <Card styles={{ body: { padding: 12, textAlign: 'left' } }} style={{ height: '100%' }}>
                            <div style={{ fontSize: 13, color: '#333', marginBottom: 12, minHeight: 60 }}>{item.t}</div>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 12, justifyContent: 'flex-end' }}>
                              <Popconfirm title="确认要重新生成这个标题吗？" onConfirm={handleTest} okText="确定" cancelText="取消">
                                <SyncOutlined style={{ color: '#999', cursor: 'pointer' }} title="重新生成" />
                              </Popconfirm>
                              <CopyOutlined style={{ color: '#999', cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(item.t); message.success('已复制文字'); }} />
                            </div>
                            <div style={{ fontSize: 11, color: '#999', lineHeight: '1.5' }}>{item.r}</div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    
                    <SectionTitle>生成详情图</SectionTitle>
                    <Row gutter={[16, 16]}>
                      {p2DetailPrRaw.map((item, idx) => (
                        <Col span={12} key={idx}>
                          <PromptCard num={idx+1} title={item.t} desc={item.d} imgSrc={isDetailImgGenerated ? p2GeneratedDetailImgs[idx] : null} onPreview={handlePreview} />
                        </Col>
                      ))}
                      <Col span={12}><AddPromptCard num={9} /></Col>
                    </Row>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                      {!isDetailImgGenerated ? (
                        <Button type="primary" shape="round" style={{ backgroundColor: '#2f54eb' }} onClick={() => setIsDetailImgGenerated(true)}>确认生成</Button>
                      ) : (
                        <Button type="primary" shape="round" style={{ backgroundColor: '#2f54eb' }} onClick={() => { p2GeneratedDetailImgs.forEach((url, i) => handleDownloadImage(url, `p_${i+1}`)); message.success('已开始批量下载详情图'); }}>下载</Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal title={<span style={{ fontSize: 16, fontWeight: 'bold' }}>选择已有商品</span>} open={isProductModalVisible} onOk={handleProductModalOk} onCancel={() => setIsProductModalVisible(false)} width={850} centered okText="确定" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ disabled: selectedRowKeys.length === 0 || !selectedRowKeys.includes('1'), style: { backgroundColor: selectedRowKeys.includes('1') ? '#2f54eb' : undefined, borderRadius: 4 } }}>
        <Table rowSelection={{ type: 'checkbox', hideSelectAll: true, selectedRowKeys, onChange: onProductSelectChange }} columns={columns} dataSource={mockTableData} pagination={false} size="middle" style={{ marginTop: 16 }} />
      </Modal>
      <Modal title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>选择类目</span>} open={isCategoryModalVisible} onCancel={() => setIsCategoryModalVisible(false)} width={900} centered footer={null} styles={{ body: { padding: '24px 32px' } }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}><Input prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} placeholder="请输入产品名称" style={{ backgroundColor: '#f5f5f5', border: 'none', height: 40 }} /><Button shape="round" style={{ height: 40, width: 80, borderColor: '#d9d9d9' }}>搜索</Button></div>
        <div style={{ color: '#999', fontSize: 12, marginBottom: 24 }}>搜索历史：剃须刀 | 赠品 | 包 | 旅行剃须刀 | 手机壳</div>
        <div style={{ display: 'flex', gap: 16, height: 350 }}>
          <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', overflowY: 'auto', paddingRight: 8 }}>{categoryData.level1.map(item => (<div key={item.id} onClick={() => { setActiveL1(item.id); setActiveL2(''); setActiveL3(''); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', borderRadius: 4, backgroundColor: activeL1 === item.id ? '#f0f5ff' : 'transparent', color: activeL1 === item.id ? '#2f54eb' : '#333' }}><span>{item.name}</span><RightOutlined style={{ fontSize: 12, color: activeL1 === item.id ? '#2f54eb' : '#bfbfbf' }} /></div>))}</div>
          <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', overflowY: 'auto', paddingRight: 8 }}>{categoryData.level2[activeL1]?.map(item => (<div key={item.id} onClick={() => { setActiveL2(item.id); setActiveL3(''); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', borderRadius: 4, backgroundColor: activeL2 === item.id ? '#f0f5ff' : 'transparent', color: activeL2 === item.id ? '#2f54eb' : '#333' }}><span>{item.name}</span><RightOutlined style={{ fontSize: 12, color: activeL2 === item.id ? '#2f54eb' : '#bfbfbf' }} /></div>))}</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>{categoryData.level3[activeL2]?.map(item => (<div key={item.id} onClick={() => handleL3Click(item)} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', borderRadius: 4, backgroundColor: activeL3 === item.id && !item.isOther ? '#f0f5ff' : 'transparent', color: activeL3 === item.id && !item.isOther ? '#2f54eb' : '#333' }}><span>{item.name}</span><RightOutlined style={{ fontSize: 12, color: activeL3 === item.id && !item.isOther ? '#2f54eb' : '#bfbfbf' }} /></div>))}</div>
        </div>
        <div style={{ border: '1px solid #e8e8e8', padding: '16px', borderRadius: 4, marginTop: 16, display: 'flex', alignItems: 'center' }}><span style={{ marginRight: 8 }}>已选项目：</span><span style={{ color: '#2f54eb' }}>{getSelectedPathName()}</span></div>
        <div style={{ textAlign: 'center', marginTop: 24 }}><Button type="primary" shape="round" size="large" disabled={isCategoryConfirmDisabled} style={{ width: 120, backgroundColor: isCategoryConfirmDisabled ? undefined : '#2f54eb', color: isCategoryConfirmDisabled ? '#999' : '#fff' }} onClick={() => { setFinalCategoryPath(getSelectedPathName().replace(/ > /g, ' >> ')); const l3Item = categoryData.level3[activeL2]?.find(item => item.id === activeL3); setSelectedBrand(l3Item && !l3Item.isOther ? l3Item.name : '其他'); setAttrFilled(true); setIsCategoryModalVisible(false); }}>确定</Button></div>
      </Modal>

      {renderOptModal("主图 — 优化图片", isImageOptModalVisible, setIsImageOptModalVisible, optimizeImageData)}
      {renderOptModal("详情图 — 优化图片", isDetailOptModalVisible, setIsDetailOptModalVisible, optimizeDetailImageData)}

      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} centered width={800} zIndex={9999} styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: 8, backgroundColor: 'transparent' } }} closeIcon={<span style={{ color: '#fff', fontSize: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4 }}>关闭</span>}>
        <img alt="preview" style={{ width: '100%', display: 'block', borderRadius: 8 }} src={previewImageSrc} />
      </Modal>
    </div>
  );
}