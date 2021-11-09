import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FaCalendarDay, FaUser, FaClock} from 'react-icons/fa';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
	first_publication_date: string | null;
	data: {
		title: string;
		banner: {
			url: string;
		};
		author: string;
		content: {
			heading: string;
			body: {
				text: string;
			}[];
		}[];
	};
}

interface PostProps {
	post: Post;
    readingTime: string;
}

export default function Post({ post, readingTime }:PostProps) {
    const router = useRouter();

    if(router.isFallback) {
        return <div>Carregando...</div>
    }

	return (
		<>
            <Head>
                <title>Blog Next | Post</title>
            </Head>
            <main className={commonStyles.container}>

                <div className={styles.banner}>
                    <img src={post.data.banner.url} alt="banner" />
                </div>

                <div className={styles.postContainer}>
                    <article>
			            <h1>{post.data.title}</h1>
                        <div className={styles.postDetailContent}>
                            <div className={styles.detail}>
                                <FaCalendarDay />
                                <time>{post.first_publication_date}</time>
                            </div>
                            <div className={styles.detail}>
                                <FaUser />
                                <span>{post.data.author}</span>
                            </div>
                            <div className={styles.detail}>
                                <FaClock />
                                <span>{readingTime}</span>
                            </div>
                        </div>

                        {post.data.content.map((content, index) => (
                            <div key={index} className={styles.postContent}>
                                <h2>{content.heading}</h2>
                                <div 
                                    dangerouslySetInnerHTML={{__html: content.body[0].text}}
                                />
                            </div>
                        ))}

                    </article>
                </div>

            </main>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ],{
      fetch: ['post.title', 'post.subtitle', 'post.author', 'post.content'],
      pageSize: 1,
      page: 1
  });

  const slugs = posts.results.map((post) => {
      return {
          params: {slug: post.uid}
      }
  });  

  return {
      paths: [ ...slugs ],
      fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug), {});

    const post: Post = {
		first_publication_date: format(
			new Date(response.first_publication_date),
			"dd MMM yyyy",
			{locale: ptBR}
		).toString(),
		data: {
			title: response.data.title,
			author: response.data.author,
			banner: {
                url: response.data.banner.url
            },
            content: response.data.content.map((content) => {
                return {
                    heading: content.heading,
                    body: [{
                        text: RichText.asHtml(content.body)
                    }]                 
                }
            }),
		}
    }


    const counterWords = post.data.content.reduce((acc, content) => {
        let soma = 0;

        soma += content.heading.split(/\s+/g).length;

        soma += content.body.reduce((acc, body) => {
            return acc + body.text.split(/\s+/g).length;
        },0);
       
        return acc + soma;
    },0);

    const readingTime = `${Math.ceil(counterWords / 200).toString()} min`

    //console.log(JSON.stringify(response,null,2))
    //console.log(JSON.stringify(post,null,2))
    //console.log(post)

  return {
      props: {
        post,
        readingTime
      }
  }
};
