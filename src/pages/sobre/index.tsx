import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import Head from "next/head";
import styles from "./styles.module.scss";

import { FaYoutube, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

type Content = {
  title: [];
  description: [];
  banner: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
};

interface ContentProps {
  content: Content;
}

export default function Sobre({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>{content.title[0].text}</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title[0].text}</h1>
            <p>
              <PrismicText field={content.description} />
            </p>
            <a href={content.youtube}>
              <FaYoutube size={40} />
            </a>
            <a href={content.instagram}>
              <FaInstagram size={40} />
            </a>
            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
            <a href={content.facebook}>
              <FaFacebook size={40} />
            </a>
          </section>

          <img src={content.banner} alt={content.banner} />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  const response = await client.get({
    filters: [prismic.filter.at("document.type", "about")],
  });

  const { title, description, banner, facebook, instagram, youtube, linkedin } =
    response.results[0].data;

  const content = {
    title: title,
    description: description,
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url,
  };

  console.log(content);

  return {
    props: { content },
    revalidate: 60 * 15, // A cada 15 minutos é revalidado
  };
};
