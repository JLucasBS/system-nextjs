import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";
import { ActiveLink } from "../ActiveLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href="/" activeClassName={styles.active}>
          <label>
            <Image src={logo} alt="Sujeito Programador logo" />
          </label>
        </ActiveLink>
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <label>Home</label>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <label>Conteúdos</label>
          </ActiveLink>
          <ActiveLink href="/sobre" activeClassName={styles.active}>
            <label>Quem somos?</label>
          </ActiveLink>
        </nav>
        <a
          className={styles.readyButton}
          type="button"
          href="https://sujeitoprogramador.com"
        >
          COMEÇAR
        </a>
      </div>
    </header>
  );
}
