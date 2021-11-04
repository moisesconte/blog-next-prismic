import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FaCalendarDay, FaUser} from 'react-icons/fa';

import { getPrismicClient } from '../services/prismic';

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
			<main className={styles.container}>
				<div className={styles.postContainer}>
                    <img src="/images/Logo.svg" alt="logo" />

                    <div>
                        <h1>Como utilizar Hooks</h1>
                        <span>Pensando em sincronização em vez de ciclos de vida.</span>
                        <div className={styles.footer}>
                            <span><FaCalendarDay size={15} />15 Mar 2021</span>
                            <span><FaUser size={15} />Joseph Oliveira</span>
                        </div>
                    </div>

                    
                </div>
			</main>
		</>
	);
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
