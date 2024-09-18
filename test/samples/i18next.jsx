import g from "url_info";
import k from "../info";
import d from "@/info";
import AppleSafariImage from "../../assets/logo/Apple Safari.svg";
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
    link.href = __CDN__ + `/packages/${font}/dist/${fileName}/result.css`;

    const mapper = {
        "USA (LA)": "United States of America",
        UK: "United Kingdom",
        Taiwan: "China",
        Kong: "China",
    };
    const text = "中文网字计划\n带来网络\n中文的爱与和谐";

    // 特殊模板字符串不进行解析
    const temp = html`<a
        href="${`/google/fonts?packageName=${item.fontId}`}"
        class="w-full"
    >
        <div
            class="flex w-full cursor-pointer flex-col"
            ref=${(dom: HTMLDivElement) => {
                if (dom) {
                    // 为了避免不同的垃圾回收导致的性能下降
                    (cacheItems.get(item.objectID) || (() => {}))();
                    const c = createEl(item, dom);
                    cacheItems.set(item.objectID, c);
                }
            }}
        ></div>
    </a>`;

    const cant = "\n";
    const cant1 = "    \n    ";

    return (
        <section class="container">
            <div class="error-bg">
                {/* <!-- 抽取所有的文本内容 --> */}
                <meta
                    name="keywords"
                    content=",中文网字计划,全字符集中文渲染方案,字体分包,字体部署,web font"
                    description="是一款精美的在线字体，可通过CSS Web引用直接使用。提供多种字体样式和设计，让您的网站更加独特和吸引人。快来体验AAA在线字体，为您的网站增添无限魅力。"
                    keywords="123232"
                />
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
                <img alt={item.name + " 的 icon"} />
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
                <div
                    style="font-family: 'LogoSC LongZhuTi';"
                    sample={" \" ' @ "}></div>

                {/* 不解析 class 属性 */}
                <div
                    class={
                        "mx-4 flex h-40 overflow-auto rounded-md bg-gray-300  p-8 md:h-80 " +
                        props.class
                    }
                    ref={scrollTargetElement}></div>
                {/* 不解析折行单符 */}
                <span class="font-sans text-xs font-thin">
                    U+{props.item.charCodeAt(0).toString(16)}
                </span>

                <span sample={" \" ' ` "}></span>
            </div>
        </section>
    );
};
