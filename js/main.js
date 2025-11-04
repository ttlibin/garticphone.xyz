// 标签页切换功能
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // 标签页切换事件
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // 游戏iframe加载优化
    const gameIframe = document.getElementById('gamePlayer');
    if (gameIframe) {
        gameIframe.addEventListener('load', function() {
            console.log('游戏加载完成');
        });
        
        // 添加加载错误处理
        gameIframe.addEventListener('error', function() {
            console.error('游戏加载失败');
            gameIframe.style.display = 'none';
            // 可以在这里添加错误提示
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 步骤动画触发
    function animateSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.6s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 当切换到规则标签页时触发动画
    const rulesTab = document.querySelector('[data-tab="rules"]');
    if (rulesTab) {
        rulesTab.addEventListener('click', function() {
            setTimeout(animateSteps, 100);
        });
    }
    
    // 游戏iframe加载状态管理
    const gameContainer = document.querySelector('.game-container');
    
    if (gameIframe && gameContainer) {
        // 创建加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading Gartic Phone Game...</p>
        `;
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--accent-color);
            z-index: 1;
        `;
        
        gameContainer.appendChild(loadingIndicator);
        
        gameIframe.addEventListener('load', function() {
            loadingIndicator.style.display = 'none';
            console.log('Gartic Phone game loaded successfully');
        });
        
        gameIframe.addEventListener('error', function() {
            loadingIndicator.innerHTML = `
                <p style="color: #E74C3C;">Failed to load game. Please check your internet connection.</p>
                <button onclick="location.reload()" style="
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Retry</button>
            `;
        });
    }
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeTab = document.querySelector('.tab-btn.active');
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentIndex = Array.from(tabButtons).indexOf(activeTab);
            let nextIndex;
            
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            } else {
                nextIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            }
            
            tabButtons[nextIndex].click();
            tabButtons[nextIndex].focus();
        }
    });
    
    // 添加页面可见性API支持
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Page is now hidden');
        } else {
            console.log('Page is now visible');
            // 页面重新可见时可以执行一些操作
        }
    });
    
    // 性能优化：防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 窗口大小改变时的优化处理
    const handleResize = debounce(() => {
        // 重新计算游戏iframe尺寸
        if (gameIframe) {
            // 响应式调整
            if (window.innerWidth < 768) {
                gameIframe.style.height = '400px';
            } else {
                gameIframe.style.height = '600px';
            }
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // 错误处理和日志
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // 可以在这里添加错误报告到分析服务
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.toString(),
                'fatal': false
            });
        }
    });
    
    // 页面加载性能监控
    window.addEventListener('load', function() {
        // 使用Performance API监控加载时间
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // 发送性能数据到Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime
                });
            }
        }
    });
    
    // Service Worker注册（为未来的PWA功能准备）
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // 暂时注释掉，可以在需要时启用
            // navigator.serviceWorker.register('/sw.js')
            //     .then(function(registration) {
            //         console.log('SW registered: ', registration);
            //     })
            //     .catch(function(registrationError) {
            //         console.log('SW registration failed: ', registrationError);
            //     });
        });
    }
    
    // 预加载关键资源
    function preloadResources() {
        const criticalResources = [
            'css/style.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    // 初始化预加载
    preloadResources();
});