# 点灯小世界 (Light Up World)

一个赛博朋克风格的点灯游戏，具有独特的视觉效果和创新的游戏机制。

![游戏截图](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20style%20light%20up%20game%20with%20neon%20lights%20and%20nodes&image_size=landscape_16_9)

## 游戏特色

- 🎨 **赛博朋克风格**：霓虹灯光效果、深色背景、未来感字体
- 🔮 **动态视觉效果**：浮动霓虹灯牌、霓虹舞狮、网格背景
- ⌛ **倒计时机制**：每回合18秒倒计时，增加游戏紧张感
- 🖱️ **流畅操作**：支持鼠标拖动、滚轮缩放
- 📊 **实时计分**：动态显示红蓝双方分数，包括蓝色方的bonus
- 📈 **赛果图查看**：游戏结束后可查看最终赛果图，支持缩放

## 游戏规则

1. **基本玩法**：点击未着色的节点，将该节点及其所有邻接节点设置为当前回合的颜色
2. **回合交替**：
   - 第一回合使用红色
   - 第二回合使用蓝色
   - 第三回合使用红色，依此类推
3. **倒计时**：
   - 每回合有18秒的时间选择节点
   - 倒计时剩余5秒时会红色闪烁提醒
   - 倒计时结束未选择节点则另一方获胜
4. **加分机制**：
   - 蓝色方加分 = 第一次红方点的灯的数量 × 0.4（向上取整）
   - 例如：红方第一次点了10个灯，蓝色方加4分
5. **胜利条件**：
   - 当所有节点都被着色时游戏结束
   - 计算最终分数：红色方分数 vs 蓝色方分数（蓝色方分数 = 蓝色灯数 + bonus）
   - 分数高的一方获胜

## 操作方法

- **选择节点**：点击未着色的节点
- **移动视图**：按住鼠标左键并拖动
- **缩放视图**：向上滚动放大，向下滚动缩小
- **开始游戏**：点击"开始回合"按钮
- **查看赛果图**：游戏结束后点击"查看赛果图"按钮
- **重新开始**：点击"再玩一次"按钮

## 技术实现

- **前端技术**：HTML5, CSS3, JavaScript
- **字体**：Orbitron（标题）、Rajdhani（正文）
- **视觉效果**：CSS动画、渐变、阴影
- **交互**：鼠标事件处理、DOM操作
- **响应式设计**：适配不同屏幕尺寸

## 如何运行

### 方法一：本地运行

1. 克隆或下载本项目到本地
2. 打开 `index.html` 文件即可开始游戏

### 方法二：使用本地服务器

1. 在项目目录下运行：
   ```bash
   python -m http.server 8000
   ```
2. 在浏览器中访问 `http://localhost:8000`

### 方法三：GitHub Pages

如果项目已部署到GitHub Pages，可直接通过以下链接访问：
`https://your-username.github.io/your-repository-name`

## 游戏截图

### 游戏主界面
![游戏主界面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20game%20interface%20with%20neon%20nodes%20and%20countdown&image_size=landscape_16_9)

### 游戏结束界面
![游戏结束界面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20game%20result%20screen%20with%20neon%20lights&image_size=landscape_16_9)

### 赛果图界面
![赛果图界面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20game%20result%20graph%20with%20colored%20nodes&image_size=landscape_16_9)

## 贡献者

- **开发者**：徐李杰珂
- **技术支持**：AI Assistant

## 许可证

MIT License

## 致谢

- Google Fonts 提供的 Orbitron 和 Rajdhani 字体
- 赛博朋克文化的灵感启发

---

希望你喜欢这个游戏！如果有任何建议或反馈，欢迎联系我们。 🎮✨
