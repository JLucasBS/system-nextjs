import Head from "next/head";
import styles from "../styles/home.module.scss";
import Image from "next/image";

import techsImage from "../../public/images/techs.svg";
import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";

import * as prismic from "@prismicio/client";

import { PrismicText } from "@prismicio/react";

type Content = {
  title: [];
  titleContent: [];
  linkAction: string;
  mobileTitle: [];
  mobileContent: [];
  mobileBanner: string;
  webTitle: [];
  webContent: [];
  webBanner: string;
};

interface ContentProps {
  content: Content;
}

export default function Home({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Apaixonado por tecnologia</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>
              <PrismicText field={content.title} />
            </h1>
            <span>
              <PrismicText field={content.titleContent} />
            </span>
            <a href={content.linkAction}>
              <button>Começar Agora!</button>
            </a>
          </section>
          <img src="/images/banner-conteudos.png" alt="Conteudos" />
        </div>

        <hr className={styles.divisor} />
        <div className={styles.sectionContent}>
          <section>
            <h2>
              <PrismicText field={content.mobileTitle} />
            </h2>
            <span>
              <PrismicText field={content.mobileContent} />
            </span>
          </section>
          <img src={content.mobileBanner} alt="Conteudos Mobile" />
        </div>
        <hr className={styles.divisor} />
        <div className={styles.sectionContent}>
          <img src={content.webBanner} alt="Conteudos Mobile" />
          <section>
            <h2>
              <PrismicText field={content.webTitle} />
            </h2>
            <span>
              <PrismicText field={content.webContent} />
            </span>
          </section>
        </div>

        <div className={styles.nextLevelContent}>
          <Image quality={100} src={techsImage} alt="Técnologias" />
          <h2>
            Mais de <span>15 mil</span> já levaram sua carreira ao próximo
            nivel.
          </h2>
          <span>
            E você vai perder a chance de evoluir de uma vez por todas?
          </span>
          <a href={content.linkAction}>
            <button>ACESSAR TURMA</button>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  const response = await client.get({
    filters: [prismic.filter.at("document.type", "home")],
  });

  // console.log(response.results[0].data);

  const {
    title,
    sub_title,
    link_action,
    mobile,
    mobile_content,
    mobile_banner,
    title_web,
    web_content,
    web_banner,
  } = response.results[0].data;

  const content = {
    title: title,
    titleContent: sub_title,
    linkAction: link_action.url,
    mobileTitle: mobile,
    mobileContent: mobile_content,
    mobileBanner: mobile_banner.url,
    webTitle: title_web,
    webContent: web_content,
    webBanner: web_banner.url,
  };

  return {
    props: {
      content,
    },
    revalidate: 60 * 2,
  };
};
