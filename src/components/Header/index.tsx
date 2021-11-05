import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
	const router = useRouter();

	function handleGoToHome() {
		router.push('/')
	}

	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<img src="/images/Logo.svg" alt="logo" onClick={handleGoToHome} />
			</div>
		</header>
	);
}
