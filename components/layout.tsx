import styles from "./layout.module.css";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>GET /graph</li>
        <li>POST /graph</li>
      </ul>
    </div>
  );
}

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
