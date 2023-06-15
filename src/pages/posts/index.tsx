import Head from "next/head";
import { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";

type Post = {
  slug: [];
  title: [];
  cover: string;
  description: string;
  updateAt: string;
};
interface PostProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Postst({
  posts: postsBlog,
  page,
  totalPage,
}: PostProps) {
  const [posts, setPosts] = useState(postsBlog || []);

  const [curentPage, setCurentPage] = useState(Number(page));

  async function reqPost(pageNumber: number) {
    const client = getPrismicClient();

    const response = await client.get({
      filters: [prismic.filter.at("document.type", "post")],
      orderings: ["document.last_publication_date"], //Ordernar pelo mais recente
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 2,
      page: pageNumber,
    });

    return response;
  }

  async function navigatePage(pageNumber: number) {
    const response = await reqPost(pageNumber);

    if (response.results.length === 0) {
      return;
    }

    const getPosts = response.results.map((post) => {
      return {
        slug: post.uid,
        title: post.data.title,
        description:
          post.data.description.find((content) => content.type === "paragraph")
            ?.text ?? "",
        cover: post.data.cover.url,
        updateAt: new Date(post.last_publication_date).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      };
    });
    setPosts(getPosts);
    setCurentPage(pageNumber);
  }
  return (
    <>
      <Head>
        <title>Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`}>
              <label>
                <Image
                  src={post.cover}
                  alt="Post titulo 1"
                  width={720}
                  height={410}
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkVn5RDwACzgGPnPNfFAAAAABJRU5ErkJggg=="
                />
                <strong>
                  <PrismicText field={post.title} />
                </strong>
                <time>{post.updateAt} </time>
                <p>{post.description}</p>
              </label>
            </Link>
          ))}
          <div className={styles.buttonNavigate}>
            {Number(curentPage) >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft size={25} color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(curentPage - 1))}>
                  <FiChevronLeft size={25} color="#fff" />
                </button>
              </div>
            )}
            {Number(curentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(curentPage + 1))}>
                  <FiChevronRight size={25} color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronsRight size={25} color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  const response = await client.get({
    filters: [prismic.filter.at("document.type", "post")],
    orderings: ["document.last_publication_date"], //Ordernar pelo mais recente
    fetch: ["post.title", "post.description", "post.cover"],
    pageSize: 2,
  });

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: post.data.title,
      description:
        post.data.description.find((content) => content.type === "paragraph")
          ?.text ?? "",
      cover: post.data.cover.url,
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });
  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 30, //atualiza a cada 30 minutos
  };
};
