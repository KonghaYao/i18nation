import React from "react";

function HomePage() {
    return (
        (<div className="container">
            <header className="header">
            </header>
            <main className="main">
                <section className="introduction">
                    <h2>{$t("i18nation1.dcb8ee94be150f19b518ddee0953d426")}</h2>
                    <p>{$t("i18nation1.4ae5785ae134aef4624533233a7ea1e0")}</p>
                </section>

                <section className="features">
                    <h2>{$t("i18nation1.96c75b9ed70cef5608d4a449caf0f547")}</h2>
                    <ul>
                        <li>{$t("i18nation1.85ad2221ea73f809bee0ccf01610317b")}</li>
                        <li>{$t("i18nation1.b698842deb0e06b4aabeb9da2c1c2462")}</li>
                        <li>{$t("i18nation1.ebf998e97b482082caf9bcf6c2d8e4aa")}</li>
                        <li>{$t("i18nation1.db3866cd6f1feeb1c713987d789c4c3d")}</li>
                    </ul>
                </section>

                <section className="cta">
                    <h2>{$t("i18nation1.129cc5acb06c0381d879e674a858c617")}</h2>
                    <p>{$t("i18nation1.78155f7f915768942cbb0649e02aec74")}</p>
                    <button className="cta-button">{$t("i18nation1.06a3c111c09306c5d889013a8bf00de1")}</button>
                </section>
            </main>
            <footer className="footer">
                <p>{$t("i18nation1.bdd7dc382be1525737c4255911203a16")}</p>
            </footer>
        </div>)
    );
}

export default HomePage;
