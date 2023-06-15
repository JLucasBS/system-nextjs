import { GetServerSideProps } from "next";
import styles from "./post.module.scss";
import { getPrismicClient } from "@/services/prismic";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import Head from "next/head";
import Image from "next/image";

interface PostProps {
  post: {
    slug: [];
    title: [];
    cover: string;
    description: [];
    updateAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title[0].text}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <Image
            src={post.cover}
            width={720}
            height={410}
            alt={post.cover}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkVn5RDwACzgGPnPNfFAAAAABJRU5ErkJggg=="
          />
          <h1>
            <PrismicText field={post.title} />
          </h1>
          <time>{post.updateAt}</time>
          <div className={styles.postContent}>
            <PrismicText field={post.description} />
          </div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;

  const client = getPrismicClient(req);

  try {
    const response = await client.getByUID("post", String(slug), {});
  } catch (err) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }

  const post = {
    slug: slug,
    title: response.data.title,
    description: response.data.description,
    cover: response.data.cover.url,
    updateAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
