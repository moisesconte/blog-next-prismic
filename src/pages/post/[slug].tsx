import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FaCalendarDay, FaUser, FaClock} from 'react-icons/fa';


import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post() {
	return (
		<>
            <Head>
                <title>Blog Next | Post</title>
            </Head>
            <main className={commonStyles.container}>

                <div className={styles.banner}>
                    <img src="/images/teste.png" alt="banner" />
                </div>

                <div className={styles.postContainer}>
                    <article>
			            <h1>Criando um app CRA do zero</h1>
                        <div className={styles.postDetailContent}>
                            <div className={styles.detail}>
                                <FaCalendarDay />
                                <time>15 Mar 2021</time>
                            </div>
                            <div className={styles.detail}>
                                <FaUser />
                                <span>Moisés Conte</span>
                            </div>
                            <div className={styles.detail}>
                                <FaClock />
                                <span>4 min</span>
                            </div>
                        </div>

                        <div className={styles.postContent}>
                            <p>teste teste teste</p>
                            <p>teste teste teste</p>
                            <p>teste teste teste</p>
                            <p>teste teste teste</p>
                        </div>

                    </article>
                </div>

            </main>
		</>
	);
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
