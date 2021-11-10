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
}

export default function Post({ post }:PostProps) {
    const router = useRouter();

    if(router.isFallback) {
        return <div>Carregando...</div>
    }

    function formatDate(date: string) {
        return format(
			new Date(date),
			"dd MMM yyyy",
			{locale: ptBR}
		);
    }

    function readingTime() {
        const counterWords = post.data.content.reduce((acc, content) => {
            let soma = 0;
    
            soma += content.heading.split(/\s+/g).length;
    
            soma += content.body.reduce((acc, body) => {
                return acc + body.text.split(/\s+/g).length;
            },0);
           
            return acc + soma;
        },0);
    
        return `${Math.ceil(counterWords / 200).toString()} min`
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
                                <time>{formatDate(post.first_publication_date)}</time>
                            </div>
                            <div className={styles.detail}>
                                <FaUser />
                                <span>{post.data.author}</span>
                            </div>
                            <div className={styles.detail}>
                                <FaClock />
                                <time>{readingTime()}</time>
                            </div>
                        </div>

                        {post.data.content.map((content, index) => (
                            <div key={index} className={styles.postContent}>
                                <h2>{content.heading}</h2>                                
                                <div
                                    className={styles.postBody} 
                                    dangerouslySetInnerHTML={{__html: RichText.asHtml(content.body)}}
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

    const post = {
        uid: response.uid,
		first_publication_date: response.first_publication_date,
		data: {
			title: response.data.title,
			author: response.data.author,
			banner: {
                url: response.data.banner.url
            },
            content: response.data.content,
            subtitle: response.data.subtitle,            
		},       
    }

/**
 * 
 * content: response.data.content.map((content) => {
                return {
                    heading: content.heading,
                    body: content.body                 
                }
            }),
 * 
 * 
 * content: response.data.content.map((content) => {
                return {
                    heading: content.heading,
                    body: [{
                        text: RichText.asHtml(content.body)
                    }]                 
                }
            }),
 */
    

    //console.log(JSON.stringify(response,null,2))
    //console.log(JSON.stringify(post,null,2))
    //console.log(post)

  return {
      props: {
        post,
      }
  }
};
