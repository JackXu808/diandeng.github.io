class LightUpGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.boardContent = document.getElementById('board-content');
        this.redCountEl = document.getElementById('red-count');
        this.blueCountEl = document.getElementById('blue-count');
        this.resetButton = document.getElementById('reset-button');
        this.resultModal = document.getElementById('result-modal');
        this.resultTitle = document.getElementById('result-title');
        this.finalRedCount = document.getElementById('final-red-count');
        this.finalBlueCount = document.getElementById('final-blue-count');
        this.winText = document.getElementById('win-text');
        this.playAgainButton = document.getElementById('play-again-button');
        
        this.nodeCount = 50;
        this.edgeCount = 300;
        this.nodes = [];
        this.edges = [];
        this.clickCount = 0;
        this.roundNumber = 1;
        this.firstRedLights = 0;
        this.blueBonus = 0;
        this.scale = 1;
        this.minScale = 0.1;
        this.maxScale = 5;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.countdownElement = document.getElementById('countdown');
        this.countdownTime = 18;
        this.countdownInterval = null;
        this.startModal = document.getElementById('start-modal');
        this.resultGraphModal = document.getElementById('result-graph-modal');
        this.resultGraphContainer = document.getElementById('result-graph-container');
        this.viewResultButton = document.getElementById('view-result-button');
        this.playAgainFromGraphButton = document.getElementById('play-again-from-graph-button');
        this.roundNumberEl = document.getElementById('round-number');
        this.currentPlayerEl = document.getElementById('current-player');
        this.startButton = document.getElementById('start-button');
        
        this.init();
    }
    
    init() {
        this.generateNetwork();
        this.updateScore();
        this.bindEvents();
        this.showStartModal();
    }
    
    startCountdown() {
        // 清除之前的倒计时
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.countdownTime = 18;
        this.updateCountdownDisplay();
        
        this.countdownInterval = setInterval(() => {
            this.countdownTime--;
            this.updateCountdownDisplay();
            
            // 检查是否倒计时结束
            if (this.countdownTime <= 0) {
                this.clearCountdown();
                this.handleCountdownEnd();
            }
        }, 1000);
    }
    
    updateCountdownDisplay() {
        this.countdownElement.textContent = this.countdownTime;
        
        // 添加或移除警告类
        if (this.countdownTime <= 5) {
            this.countdownElement.classList.add('warning');
        } else {
            this.countdownElement.classList.remove('warning');
        }
    }
    
    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        this.countdownElement.classList.remove('warning');
    }
    
    resetCountdown() {
        this.startCountdown();
    }
    
    handleCountdownEnd() {
        // 倒计时结束，另一方获胜
        const winner = this.clickCount % 2 === 0 ? 'blue' : 'red';
        const winnerText = winner === 'red' ? '红色' : '蓝色';
        
        // 显示结果
        this.finalRedCount.textContent = winner === 'red' ? this.nodeCount : 0;
        this.finalBlueCount.textContent = winner === 'blue' ? this.nodeCount + 3 : 0;
        
        this.winText.textContent = `${winnerText}获胜！`;
        this.winText.className = `win-text ${winner}`;
        
        this.resultModal.classList.add('show');
    }
    
    generateNetwork() {
        this.clearBoard();
        this.nodes = [];
        this.edges = [];
        
        // 生成结点，确保分布合理
        for (let i = 0; i < this.nodeCount; i++) {
            // 使用更大的画布空间来生成节点，确保分布均匀
            const x = Math.random() * 1000 + 50;
            const y = Math.random() * 1000 + 50;
            
            const node = {
                id: i,
                x: x,
                y: y,
                color: null,
                element: null,
                neighbors: []
            };
            
            this.nodes.push(node);
        }
        
        // 生成边
        let edgesCreated = 0;
        while (edgesCreated < this.edgeCount) {
            const node1 = Math.floor(Math.random() * this.nodeCount);
            const node2 = Math.floor(Math.random() * this.nodeCount);
            
            if (node1 !== node2 && !this.nodes[node1].neighbors.includes(node2)) {
                this.nodes[node1].neighbors.push(node2);
                this.nodes[node2].neighbors.push(node1);
                edgesCreated++;
            }
        }
        
        // 渲染网络
        this.renderNetwork();
    }
    
    renderNetwork() {
        // 渲染边
        this.nodes.forEach((node, index) => {
            node.neighbors.forEach(neighborIndex => {
                if (index < neighborIndex) { // 避免重复绘制边
                    this.createEdge(node, this.nodes[neighborIndex]);
                }
            });
        });
        
        // 渲染结点
        this.nodes.forEach(node => {
            this.createNode(node);
        });
    }
    
    createEdge(node1, node2) {
        const edge = document.createElement('div');
        edge.className = 'edge';
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        edge.style.width = `${length}px`;
        edge.style.left = `${node1.x}px`;
        edge.style.top = `${node1.y + 10}px`;
        edge.style.transform = `rotate(${angle}deg)`;
        
        this.boardContent.appendChild(edge);
        this.edges.push(edge);
    }
    
    createNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.style.left = `${node.x - 10}px`;
        nodeElement.style.top = `${node.y - 10}px`;
        
        nodeElement.addEventListener('click', () => this.handleNodeClick(node));
        
        this.boardContent.appendChild(nodeElement);
        node.element = nodeElement;
    }
    
    handleNodeClick(node) {
        // 检查节点是否已经着色，如果已经着色则不允许点击
        if (node.color !== null) {
            return;
        }
        
        // 根据点击次数决定颜色，实现红蓝交替
        const color = this.clickCount % 2 === 0 ? 'red' : 'blue';
        this.clickCount++;
        
        // 计算本次点亮的灯的数量
        const lightsCount = 1 + node.neighbors.length;
        
        // 如果是第一次红方点击，记录点亮的灯的数量并计算蓝色方的bonus
        if (color === 'red' && this.firstRedLights === 0) {
            this.firstRedLights = lightsCount;
            this.blueBonus = Math.ceil(this.firstRedLights * 0.4);
        }
        
        this.setNodeColor(node, color);
        node.neighbors.forEach(neighborIndex => {
            this.setNodeColor(this.nodes[neighborIndex], color);
        });
        
        this.updateScore();
        this.checkGameEnd();
        
        // 重置倒计时，开始下一回合
        this.resetCountdown();
    }
    
    setNodeColor(node, color) {
        node.color = color;
        node.element.className = `node ${color}`;
    }
    
    updateScore() {
        const redCount = this.nodes.filter(node => node.color === 'red').length;
        const blueCount = this.nodes.filter(node => node.color === 'blue').length;
        
        this.redCountEl.textContent = redCount;
        
        // 如果蓝色方有bonus，在蓝色灯数后面显示"+数字"
        if (this.blueBonus > 0) {
            this.blueCountEl.textContent = `${blueCount}+${this.blueBonus}`;
        } else {
            this.blueCountEl.textContent = blueCount;
        }
    }
    
    checkGameEnd() {
        const allColored = this.nodes.every(node => node.color !== null);
        
        if (allColored) {
            this.endGame();
            return true;
        }
        
        return false;
    }
    
    endGame() {
        // 清除倒计时
        this.clearCountdown();
        
        let redCount = this.nodes.filter(node => node.color === 'red').length;
        let blueCount = this.nodes.filter(node => node.color === 'blue').length;
        let blueTotal = blueCount + this.blueBonus;
        
        // 在结果模态框中显示蓝色方的分数，包括bonus
        if (this.blueBonus > 0) {
            this.finalRedCount.textContent = redCount;
            this.finalBlueCount.textContent = `${blueCount}+${this.blueBonus}=${blueTotal}`;
        } else {
            this.finalRedCount.textContent = redCount;
            this.finalBlueCount.textContent = blueCount;
        }
        
        let winner, winnerColor;
        if (redCount > blueTotal) {
            winner = '红色';
            winnerColor = 'red';
        } else if (blueTotal > redCount) {
            winner = '蓝色';
            winnerColor = 'blue';
        } else {
            winner = '平局';
            winnerColor = 'red';
        }
        
        this.winText.textContent = `${winner}获胜！`;
        this.winText.className = `win-text ${winnerColor}`;
        
        this.resultModal.classList.add('show');
    }
    
    clearBoard() {
        this.boardContent.innerHTML = '';
    }
    
    resetGame() {
        this.resultModal.classList.remove('show');
        this.resultGraphModal.classList.remove('show');
        this.clickCount = 0;
        this.roundNumber = 1;
        this.firstRedLights = 0;
        this.blueBonus = 0;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateTransform();
        this.generateNetwork();
        this.updateScore();
        this.showStartModal();
    }
    
    bindEvents() {
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.playAgainButton.addEventListener('click', () => this.resetGame());
        this.viewResultButton.addEventListener('click', () => this.viewResultGraph());
        this.playAgainFromGraphButton.addEventListener('click', () => this.resetGame());
        this.startButton.addEventListener('click', () => this.startRound());
        
        // 添加鼠标滚轮缩放功能
        this.board.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // 计算缩放比例
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * delta));
            
            if (newScale !== this.scale) {
                this.scale = newScale;
                this.updateTransform();
            }
        });
        
        // 添加鼠标拖动功能，优化流畅度
        this.board.addEventListener('mousedown', (e) => {
            if (e.target === this.board || e.target === this.boardContent) {
                this.isDragging = true;
                this.startX = e.clientX - this.offsetX;
                this.startY = e.clientY - this.offsetY;
                // 优化：添加鼠标捕获，确保拖动更流畅
                this.board.setPointerCapture(e.pointerId);
            }
        });
        
        this.board.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.offsetX = e.clientX - this.startX;
                this.offsetY = e.clientY - this.startY;
                // 优化：直接更新transform，避免多次重排
                this.boardContent.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
            }
        });
        
        this.board.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            // 释放鼠标捕获
            this.board.releasePointerCapture(e.pointerId);
        });
        
        this.board.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }
    
    showStartModal() {
        // 更新回合信息
        this.roundNumberEl.textContent = this.roundNumber;
        
        // 更新当前玩家信息
        const currentPlayer = this.clickCount % 2 === 0 ? 'red' : 'blue';
        const playerText = currentPlayer === 'red' ? '红色方' : '蓝色方';
        
        this.currentPlayerEl.textContent = playerText;
        this.currentPlayerEl.className = `player-color ${currentPlayer}`;
        
        // 显示开始模态框
        this.startModal.classList.add('show');
    }
    
    startRound() {
        // 隐藏开始模态框
        this.startModal.classList.remove('show');
        
        // 开始倒计时
        this.startCountdown();
    }
    
    viewResultGraph() {
        // 隐藏结果模态框
        this.resultModal.classList.remove('show');
        
        // 清空赛果图容器
        this.resultGraphContainer.innerHTML = '';
        
        // 创建赛果图
        const graphWidth = 800;
        const graphHeight = 600;
        
        // 创建一个新的网络图容器
        const graphContainer = document.createElement('div');
        graphContainer.style.width = `${graphWidth}px`;
        graphContainer.style.height = `${graphHeight}px`;
        graphContainer.style.position = 'relative';
        graphContainer.style.overflow = 'auto';
        graphContainer.style.backgroundColor = 'rgba(10, 10, 26, 0.5)';
        graphContainer.style.borderRadius = '5px';
        graphContainer.style.border = '2px solid var(--primary-color)';
        graphContainer.style.cursor = 'grab';
        
        // 创建内部内容容器，用于实现缩放
        const graphBoard = document.createElement('div');
        graphBoard.style.width = `${graphWidth}px`;
        graphBoard.style.height = `${graphHeight}px`;
        graphBoard.style.position = 'relative';
        graphBoard.style.transformOrigin = 'top left';
        graphBoard.style.transition = 'transform 0.2s ease';
        
        // 计算节点位置的缩放比例，确保所有节点都能在容器中显示
        const minX = Math.min(...this.nodes.map(node => node.x));
        const maxX = Math.max(...this.nodes.map(node => node.x));
        const minY = Math.min(...this.nodes.map(node => node.y));
        const maxY = Math.max(...this.nodes.map(node => node.y));
        
        const xScale = (graphWidth - 40) / (maxX - minX || 1);
        const yScale = (graphHeight - 40) / (maxY - minY || 1);
        const scale = Math.min(xScale, yScale);
        
        // 渲染边
        this.nodes.forEach((node, index) => {
            node.neighbors.forEach(neighborIndex => {
                if (index < neighborIndex) { // 避免重复绘制边
                    const neighbor = this.nodes[neighborIndex];
                    
                    const edge = document.createElement('div');
                    edge.className = 'edge';
                    
                    const scaledX1 = (node.x - minX) * scale + 20;
                    const scaledY1 = (node.y - minY) * scale + 20;
                    const scaledX2 = (neighbor.x - minX) * scale + 20;
                    const scaledY2 = (neighbor.y - minY) * scale + 20;
                    
                    const dx = scaledX2 - scaledX1;
                    const dy = scaledY2 - scaledY1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    edge.style.width = `${length}px`;
                    edge.style.left = `${scaledX1}px`;
                    edge.style.top = `${scaledY1 + 10}px`;
                    edge.style.transform = `rotate(${angle}deg)`;
                    
                    graphBoard.appendChild(edge);
                }
            });
        });
        
        // 渲染节点
        this.nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `node ${node.color}`;
            
            const scaledX = (node.x - minX) * scale + 20;
            const scaledY = (node.y - minY) * scale + 20;
            
            nodeElement.style.left = `${scaledX - 10}px`;
            nodeElement.style.top = `${scaledY - 10}px`;
            
            graphBoard.appendChild(nodeElement);
        });
        
        // 添加缩放功能
        let currentScale = 1;
        const minScale = 0.1;
        const maxScale = 5;
        
        graphContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(minScale, Math.min(maxScale, currentScale * delta));
            
            if (newScale !== currentScale) {
                currentScale = newScale;
                graphBoard.style.transform = `scale(${currentScale})`;
            }
        });
        
        // 添加内容容器到外部容器
        graphContainer.appendChild(graphBoard);
        
        // 添加赛果图到容器
        this.resultGraphContainer.appendChild(graphContainer);
        
        // 显示赛果图模态框
        this.resultGraphModal.classList.add('show');
    }
    
    updateTransform() {
        this.boardContent.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new LightUpGame();
});