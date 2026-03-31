import os
import re
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import dashscope
from dashscope import Generation

# --- 1. 路径与环境配置 (核心修改) ---
# 获取项目根目录 (backend 的上一级)
BASE_DIR = Path(__file__).resolve().parent.parent
# 加载根目录下的 .env 文件
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
CORS(app)

# 从环境变量获取 API Key，不再硬编码在代码里
dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")

# 自建基础违禁词库
PROHIBITED_WORDS = ["第一", "全网最", "销量冠军", "顶级", "极致", "最强", "NO.1"]

# --- 2. 逻辑函数 ---
def check_title_compliance(title):
    found_words = [word for word in PROHIBITED_WORDS if word in title]
    char_count = len(title)
    if found_words:
        return "warning", f"检测到违禁词：{', '.join(found_words)}。请删除以防违规处罚。"
    if char_count > 60:
        return "warning", f"标题长度为 {char_count} 字符，超过 60 字符上限，建议精简。"
    return "success", "标题符合规范"

# --- 3. 路由接口 ---
@app.route('/api/optimize_title', methods=['POST'])
def optimize_title():
    # 检查 API Key 是否配置成功
    if not dashscope.api_key:
        return jsonify({"error": "未检测到 API Key，请检查根目录 .env 文件"}), 500

    data = request.json
    raw_title = data.get('title', '')
    category = data.get('category', '通用')

    if not raw_title:
        return jsonify({"error": "标题不能为空"}), 400

    status, diagnosis = check_title_compliance(raw_title)

    prompt = f"""
    你是一个淘宝运营专家。请针对以下商品标题进行优化。
    原始标题：{raw_title}
    所属类目：{category}
    要求：1.限制在30汉字内；2.关键词前置；3.生成3个风格；4.提供逻辑；5.严禁编造参数；6.严禁违禁词。
    返回格式必须是严格的 JSON: {{"suggestions": [{{"t": "标题", "r": "逻辑"}}]}}
    """

    try:
        response = Generation.call(
            model=Generation.Models.qwen_max,
            prompt=prompt,
            result_format='message'
        )

        if response.status_code == 200:
            ai_content = response.output.choices[0].message.content
            # 使用正则精准提取 JSON 部分
            match = re.search(r'\{.*\}', ai_content, re.DOTALL)
            if match:
                import json
                json_data = json.loads(match.group())
                return jsonify({
                    "diagnosis_result": diagnosis,
                    "status": status,
                    "optimized_suggestions": json_data["suggestions"]
                })
            return jsonify({"error": "AI 返回格式异常"}), 500
        else:
            return jsonify({"error": f"DashScope 错误: {response.message}"}), 500

    except Exception as e:
        return jsonify({"error": f"服务器内部错误: {str(e)}"}), 500

if __name__ == '__main__':
    # debug=True 适合开发环境
    app.run(debug=True, port=5000)