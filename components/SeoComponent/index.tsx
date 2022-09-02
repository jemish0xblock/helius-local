import Head from "next/head";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import appConfig from "@/config";
import { seoConfig, staticImagesUrl } from "@utils/constants";

interface IMetaDetailsObj {
  title: string;
  titleTemplateAvail: boolean;
  desc: string;
  canonical: string;
  image?: string;
  titleIcon?: string;
  keywords?: string;
}

interface IMetaDetailsProps {
  metaDetail?: IMetaDetailsObj | any;
}

const MetaSEO: FC<IMetaDetailsProps> = ({ metaDetail }) => {
  const { t } = useTranslation();

  const title = metaDetail?.titleTemplateAvail ? `${metaDetail?.title} | Helius` : "Helius";
  const desc = metaDetail?.desc;
  const canonical = metaDetail?.canonical || ""; // Page url
  const image = metaDetail?.image || staticImagesUrl.siteLogo;
  const siteKeywords = metaDetail?.keywords || "";

  return (
    <Head>
      <title key="title">{title}</title>
      <meta name="description" content={desc} />
      {metaDetail?.keywords && <meta name="keywords" content={siteKeywords} />}
      {metaDetail?.canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={title} />
      <meta name="og:description" property="og:description" content={desc} />
      <meta property="og:site_name" content={t("app_title")} />
      <meta property="og:locale" content="en" />
      <meta property="og:url" content={appConfig.LIVE_URL} />
      <meta property="og:image" content={`${appConfig.LIVE_URL}/img/Logo1100x400.png`} />

      {/* Alternative */}
      <link
        rel="alternate"
        key="languageAlternate-en"
        hrefLang="en"
        href={`${appConfig.LIVE_URL}/locals/en/common.json`}
      />

      {/* Additional links */}
      {seoConfig.additionalLinkTags?.length &&
        seoConfig.additionalLinkTags.map((tag: any) => (
          <link key={`link${tag?.keyOverride ?? tag.href}${tag.rel}`} {...tag} />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:site" content="@propernounco" />
      <meta name="twitter:creator" content="@propernounco" />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

MetaSEO.defaultProps = {
  metaDetail: seoConfig,
};

export default MetaSEO;
