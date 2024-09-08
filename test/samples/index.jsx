<>
<!DOCTYPE html>
<html lang={lang} class={htmlClass}>
    <head>
        {/*  Global Metadata  */}
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="generator" content={Astro.generator} />
        <slot name="meta" />
        {/*  Primary Meta Tags  */}
        <SEO
            title={title}
            description={description}
            openGraph={{
                basic: {
                    title: title,
                    type: ogType ?? 'website',
                    image:
                        image ??
                        'https://ik.imagekit.io/chinesefonts/image/website_description.png?updatedAt=1685230267522&tr=w-1200%2Ch-675%2Cfo-auto',
                },
                optional: {
                    siteName: '中文网字计划',
                },
            }}
        />
        <meta
            name="keywords"
            content={keywords + ',中文网字计划,全字符集中文渲染方案,字体分包,字体部署,web font'}
        />
        <link rel="preconnect" href="https://chinese-fonts-cdn.netlify.app" crossorigin />
        <link rel="stylesheet" href={defaultFontCSS} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net/" crossorigin />
        <link rel="preconnect" href="https://jsdelivr.deno.dev/" crossorigin />
    </head>
    <body style={style} class={className}>
        <GlobalHeader />
        <slot />
        <Sentry />
    </body>
</html>
</>