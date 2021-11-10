import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { FaCalendarDay, FaUser} from 'react-icons/fa';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
	uid?: string;
	first_publication_date: string | null;
	data: {
		title: string;
		subtitle: string;
		author: string;
	};
}

interface PostPagination {
	next_page: string;
	results: Post[];
}

interface HomeProps {
	postsPagination: PostPagination;
}

export default function Home({ postsPagination } : HomeProps) {
	const [posts, setPosts] = useState<PostPagination>(postsPagination);

	function formatDate(data: string) {
		return format(
			new Date(data),
			"dd MMM yyyy",
			{locale: ptBR}
		)
	}

	async function carregarMaisPost(){
		const response = await fetch(postsPagination.next_page,{method: 'GET'});
		if(response.ok) {
			const json = await response.json();
			//console.log(json);			 
			
			const listPost = json.results.map((post: Post) => {
				return {
					uid: post.uid,
					first_publication_date: post.first_publication_date,
					data: {
						title: post.data.title,
						subtitle: post.data.subtitle,
						author: post.data.author,
					}
				}
			});			

			setPosts(prev => { return {next_page: json.next_page, results: [...prev.results, ...listPost]}})
			//console.log(listPost);
		}	
	}

	return (
		<>
            <Head>
                <title>Blog Next | Desafio</title>
            </Head>
			<main className={commonStyles.container}>

				<div className={styles.postsContainer}>
					
					{posts.results.map((post, index) => (
						<Link key={index} href={`/post/${post.uid}`}>
							<a>
								<div className={styles.post}>
									
										<h1>{post.data.title}</h1>
									
									<span>{post.data.subtitle}</span>
									<div className={styles.postFooter}>
										<time><FaCalendarDay size={15} />{formatDate(post.first_publication_date)}</time>
										<span><FaUser size={15} />{post.data.author}</span>
									</div>
								</div>
							</a>
						</Link>
					))}
					
					{posts.next_page && (<div className={styles.footer}>
						<span onClick={carregarMaisPost}>Carregar mais posts</span>
					</div>)}
				</div>					
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
   const prismic = getPrismicClient();

   const postsResponse = await prismic.query([
	   Prismic.Predicates.at('document.type', 'post')
   ], {
	   fetch: ['post.title', 'post.subtitle', 'post.author', 'post.content'],
	   pageSize: 1,
   });

   const posts = postsResponse.results.map(post => {		
	
		return {
		   uid: post.uid,
		   first_publication_date: post.first_publication_date,
		   data: {
			title: post.data.title,
			subtitle: post.data.subtitle,
			author: post.data.author,
		   }
		}
   });

   //console.log(postsResponse)
   //console.log(JSON.stringify(postsResponse,null,2));

   return {
	   props: {
			postsPagination: {
				next_page: postsResponse.next_page,
				results: posts,
			}
	   }
   }
};
