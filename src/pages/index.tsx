import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FaCalendarDay, FaUser} from 'react-icons/fa';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
	return (
		<>
            <Head>
                <title>Blog Next | Desafio</title>
            </Head>
			<main className={commonStyles.container}>

				<div className={styles.postsContainer}>
					
					<div className={styles.post}>
						<h1>Como utilizar Hooks</h1>
						<span>Pensando em sincronização em vez de ciclos de vida.</span>
						<div className={styles.postFooter}>
							<span><FaCalendarDay size={15} />15 Mar 2021</span>
							<span><FaUser size={15} />Joseph Oliveira</span>
						</div>
					</div>

					<div className={styles.post}>
						<h1>Como utilizar Hooks</h1>
						<span>Pensando em sincronização em vez de ciclos de vida.</span>
						<div className={styles.postFooter}>
							<span><FaCalendarDay size={15} />15 Mar 2021</span>
							<span><FaUser size={15} />Joseph Oliveira</span>
						</div>
					</div>
					
					<div className={styles.footer}>
						<span>Carregar mais posts</span>
					</div>
				</div>					
			</main>
		</>
	);
}

export const getStaticProps = async () => {
   const prismic = getPrismicClient();
   const postsResponse = await prismic.query([
	   Prismic.Predicates.at('document.type', 'post')
   ], {
	   fetch: ['post.title', 'post.content'],
	   pageSize: 3,
   });

   const posts = postsResponse.results.map(post => {
	   return {
		   slug: post.uid,
		   banner: post.data.banner,
		   first_publication_date: post.first_publication_date,
		   data: {
			title: post.data.title,
			subtitle: post.data.heading,
			author: post.data.author,
		   }
	   }
   });

   console.log(posts)

  // console.log(JSON.stringify(postsResponse,null,2));

   return {
	   props: {
		   
	   }
   }
};
