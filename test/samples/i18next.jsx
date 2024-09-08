import g from "url_info";
import k from "../info";
import d from "@/info";
export default () => {
    // 单个单词：外部扩展为不被选中
    const info = "hello";
    const data = "useful-info";
    const enumWord = "TEST_KEY";
    const percent = "100%";
    const color = "#300";
    const ext = ".woff2";
    const void_str = "   ";

    // 多个单词：必定选中
    const replaced = "hello world";

    // 模板字符串通通被选中
    const templateTest = `prefix${info + "23232"}after`;

    const obj = {
        // value 均遵循单词方式，key 永不选中
        name: "my-component-name",
    };
    // 作为 key 永不选中
    const item = obj["name info"];
    const item2 = obj[`name_${info}`];

    // 不能抽取类url模板字符串
    fetch(`https://jsdelivr.deno.dev/npm/font-analyze@1.3.3/data/${name}`).then(
        (res) => res.json()
    );
    return (
        <section class="container">
            <div class="error-bg">
                {/* <!-- 抽取所有的文本内容 --> */}
                <p class="err-title">404 RightThisWay</p>
                <p class="err-msg">Soury,&nbsp;&nbsp;&nbsp; Invisible~</p>
                <p class="err-msg"> {"info"} </p>
                <p class="err-msg"> prefix{"info"}suffix </p>
                <pre class="err-msg"> prefix{"info"}suffix </pre>
                <code class={"err-msg" + 323423}> code info </code>
                <style>info mation</style>
                {/* <!-- 需要抽取 alt 属性 --> */}
                <img
                    class="err-msg"
                    alt="important message"
                    src="./index.jpg"
                />
                <img
                    class="err-msg"
                    alt={"important message"}
                    src="./index.jpg"
                />
                {/* style */}
                <style>
                    {` @font-face {font-family: '${fontFamily()}';src: url(${
                        props.fontURL
                    });}`}
                </style>
                <div
                    title="info mation"
                    placeholder="skip"
                    alt="./index.jpg"
                    style={{
                        "font-feature-settings": `"${i}" 0`,
                    }}>
                    {sub_text}
                </div>

                {/*  正确解析花括号 */}
                <div style="font-family: 'LogoSC LongZhuTi';"></div>
            </div>
        </section>
    );
};
