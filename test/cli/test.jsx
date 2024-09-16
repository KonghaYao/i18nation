import React from "react";

function HomePage() {
    return (
        <div className="container">
            <header className="header">
                <h1>欢迎来到中文网字计划</h1>
            </header>

            <main className="main">
                <section className="introduction">
                    <h2>项目简介</h2>
                    <p>
                        中文网字计划致力于推动中文互联网的发展，通过提供高质量的网络字体资源，使中文网站更加美观、易读，并且能够更好地适应不同的设备和屏幕尺寸。
                    </p>
                </section>

                <section className="features">
                    <h2>特色</h2>
                    <ul>
                        <li>广泛的字符覆盖范围</li>
                        <li>适用于多种操作系统和浏览器</li>
                        <li>开放源代码，鼓励社区贡献</li>
                        <li>易于集成到现有网页设计中</li>
                    </ul>
                </section>

                <section className="cta">
                    <h2>立即行动</h2>
                    <p>
                        如果您想了解更多关于我们的计划，或者想要获取我们的网络字体，请点击下面的按钮开始探索！
                    </p>
                    <button className="cta-button">了解更多</button>
                </section>
            </main>

            <footer className="footer">
                <p>&copy; 2024 中文网字计划. 版权所有.</p>
            </footer>
        </div>
    );
}

export default HomePage;
