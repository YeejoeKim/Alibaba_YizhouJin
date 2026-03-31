import time
import pandas as pd
import re
import random
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# ================= 配置区 =================
# 20个主流精选类目
KEYWORDS = [
    # 第一组：服饰穿搭
    "T恤", "卫衣", "牛仔裤", "运动鞋",
    # 第二组：美妆个护
    "口红", "面膜", "洗发水", "香水",
    # 第三组：家居日用
    "四件套", "保温杯", "收纳箱", "抽纸",
    # 第四组：数码3C
    "手机壳", "蓝牙耳机", "充电宝", "智能手环",
    # 第五组：生活兴趣
    "猫粮", "瑜伽垫", "坚果", "露营灯"
]

# 每个类目抓 20 个，预计总共获取 400 条数据
MAX_ITEMS_PER_CAT = 20


# =========================================

def get_taobao_data():
    print(">>> 启动浏览器...")

    # 1. 设置浏览器防检测参数
    options = Options()
    # 【关键】脚本结束后保持浏览器开启
    options.add_experimental_option("detach", True)
    # 去除自动化控制特征
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    driver = webdriver.Chrome(options=options)

    # 生成带时间戳的文件名，防止文件被占用报错
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"taobao_data_{timestamp}.csv"

    try:
        # 2. 扫码登录环节
        print(">>> 打开登录页...")
        driver.get("https://login.taobao.com/member/login.jhtml")
        print("\n⚠️⚠️⚠️ 请拿出手机扫码登录！(程序将一直等待，直到你完成跳转) ⚠️⚠️⚠️")

        # 循环检测是否跳转
        while "login.taobao.com" in driver.current_url:
            time.sleep(1)
        print(">>> 检测到登录成功！")

        all_data = []

        # 3. 循环抓取 20 个类目
        for keyword in KEYWORDS:
            print(f"\n>>> [{keyword}] 正在搜索...")
            try:
                driver.get(f"https://s.taobao.com/search?q={keyword}")

                # ==========================================
                # 🛑 人工确认环节 (防止白屏/验证码)
                # ==========================================
                print("\n" + "=" * 50)
                print(f"当前进度: 正在抓取 [{keyword}]")
                print("1. 请切换回浏览器，看一眼商品列表是否加载出来？")
                print("2. 如果是白屏，请手动【刷新】或【下滑】。")
                print("3. 确认看到商品后，回来这里输入 'y' 并按回车...")
                print("=" * 50)

                while True:
                    # 只要不输入y，就死循环等待，确保你准备好了
                    if input(">>> 商品出来了吗？(输入 y 继续): ").lower() == 'y':
                        break

                print(f">>> 正在提取 [{keyword}] 的数据...")

                # 查找页面所有链接
                links = driver.find_elements(By.TAG_NAME, "a")

                count = 0
                seen = set()  # 去重集合

                for link in links:
                    if count >= MAX_ITEMS_PER_CAT: break

                    try:
                        href = link.get_attribute("href")
                        raw_text = link.text

                        # 筛选逻辑：必须是商品链接，且文本内容丰富
                        if href and "item.htm" in href and len(raw_text) > 10 and "click" not in href:
                            if href in seen: continue
                            seen.add(href)

                            # --- A. 提取图片 (含懒加载处理) ---
                            img_url = ""
                            try:
                                img_elem = link.find_element(By.TAG_NAME, "img")
                                img_url = img_elem.get_attribute("src")
                                if not img_url or "base64" in img_url or "blank" in img_url:
                                    lazy_src = img_elem.get_attribute("data-src")
                                    if lazy_src: img_url = lazy_src
                                if img_url and img_url.startswith("//"):
                                    img_url = "https:" + img_url
                            except:
                                pass

                            # --- B. 提取价格 ---
                            price = "0"
                            price_match = re.search(r'[¥￥]\s*(\d+(\.\d+)?)', raw_text)
                            if price_match: price = price_match.group(1)

                            # --- C. 多维热度提取 (智能识别销量/回头客/评价) ---
                            sales = "0"
                            sales_type = "无数据"

                            # C1. 优先找 "付款/已售"
                            pay_match = re.search(r'(\d+(?:\.\d+)?[万wW]?\+?)\s*(人付款|已售|月销|付款)', raw_text)
                            if pay_match:
                                sales = pay_match.group(1)
                                sales_type = "付款人数"
                            else:
                                # C2. 没销量？找 "回头客"
                                loyal_match = re.search(r'回头客\s*(\d+(?:\.\d+)?[万wW]?\+?)', raw_text)
                                if loyal_match:
                                    sales = loyal_match.group(1)
                                    sales_type = "回头客数"
                                else:
                                    # C3. 也没回头客？找 "评价"
                                    comment_match = re.search(r'(\d+(?:\.\d+)?[万wW]?\+?)\s*(条?评价|条?评论)',
                                                              raw_text)
                                    if comment_match:
                                        sales = comment_match.group(1)
                                        sales_type = "评价数"

                            # --- D. 提取标题 ---
                            lines = raw_text.split('\n')
                            title = max(lines, key=len) if lines else raw_text

                            # 控制台打印一条预览
                            print(f"   ✅ {title[:10]}... | 💰{price} | 🔥{sales}({sales_type})")

                            all_data.append({
                                "类目": keyword,
                                "标题": title,
                                "价格": price,
                                "热度数值": sales,
                                "热度类型": sales_type,
                                "主图链接": img_url,
                                "商品链接": href,
                                "原始文本": raw_text.replace('\n', ' ')
                            })
                            count += 1

                    except:
                        continue

            except Exception as e:
                print(f"❌ 抓取类目 [{keyword}] 时出错: {e}")

            # 随机休息 3-6 秒，模拟真人操作，防止翻页太快被封
            sleep_time = random.uniform(3, 6)
            print(f">>> 本类目完成，休息 {sleep_time:.1f} 秒...")
            time.sleep(sleep_time)

        # 4. 保存最终文件
        if all_data:
            df = pd.DataFrame(all_data)
            df.to_csv(output_file, index=False, encoding="utf_8_sig")
            print(f"\n🎉🎉🎉 全部任务完成！")
            print(f"👉 共抓取 {len(all_data)} 条数据")
            print(f"👉 数据已保存到: {output_file}")
            print(f"👉 (请用 Excel 打开检查，若有乱码请用记事本打开再另存为ANSI)")
        else:
            print("\n😭 本次未抓取到数据，请检查网络或登录状态。")

    except Exception as e:
        print(f"❌ 程序发生严重错误: {e}")

    finally:
        print("\n🛑 程序结束，浏览器将保持打开状态。")


if __name__ == "__main__":
    get_taobao_data()