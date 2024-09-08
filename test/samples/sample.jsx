export default () => {
    const info = "This is a message";
    return (
        <section class="container">
            <div class="error-bg">
                {/* 抽取所有的文本内容  */}
                <p class="err-title">404 RightThisWay</p>
                {/* BUG 暂时匹配不到 动态赋予的 string */}
                <p class="err-msg"> prefix{info}suffix </p>
                <p class="err-msg"> prefix{"templateString"}suffix </p>
                {/*  需要抽取 alt 属性  */}
                <img
                    class="err-msg"
                    alt="important message"
                    src="./index.jpg"
                />
                <img class="err-msg" alt={id + 2} src="./index.jpg" />
            </div>
        </section>
    );
};
