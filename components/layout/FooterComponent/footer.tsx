import { Layout } from "antd";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import styles from "@components/layout/FooterComponent/footer.module.less";
import { FacebookSvg, LinkedinSvg, TweeterSvg } from "@utils/allSvgs";

const { Footer } = Layout;

const FooterComponent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Footer className={styles.h_footer_main} style={{ position: "sticky", zIndex: 1, width: "100%" }}>
      <div className="container">
        <div className="main-screen-content">
          <span className={styles.footer_content}>
            {t(`footer.copyright`)}@ {t(`app_title`)} {new Date().getFullYear()} |
            <Link href="/legal/terms?slug=user-agreement" passHref>
              <a href="replace" className={styles.h_footer_links}>
                {t(`footer.termsOfService`)}
              </a>
            </Link>
            |
            <Link href="/legal/privacy?slug=user-agreement" passHref>
              <a href="replace" className={styles.h_footer_links}>
                {t(`footer.privacyPolicy`)}
              </a>
            </Link>
            |
            <Link href="/accessibility" passHref>
              <a href="replace" className={styles.h_footer_links}>
                {t(`footer.accessibility`)}
              </a>
            </Link>
          </span>

          <ul className={styles.h_footer_social_main}>
            <li className={styles.h_social_link}>
              <Link href="https://www.facebook.com/" passHref>
                <a href="replace" target="_blank">
                  <InlineSVG src={FacebookSvg} height="auto" className="isVerified" />
                </a>
              </Link>
            </li>
            <li className={styles.h_social_link}>
              <Link href="https://www.linkedin.com/" passHref>
                <a href="replace" target="_blank">
                  <InlineSVG src={LinkedinSvg} height="auto" className="isVerified" />
                </a>
              </Link>
            </li>
            <li className={styles.h_social_link}>
              <Link href="https://twitter.com/" passHref>
                <a href="replace" target="_blank">
                  <InlineSVG src={TweeterSvg} height="auto" className="isVerified" />
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
