import { Box } from "@chakra-ui/react";
import styles from "./layout.module.css";

import Header from "./header";
import Sidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <Box as="main" className="main-content" w="full" maxW="8xl" mx="auto">
        <Box display={{ md: "flex" }}>
          <Sidebar />
          <Box flex="1" minW="0">
            <main className={styles.main}>{children}</main>
          </Box>
        </Box>
      </Box>
    </>
  );
}
