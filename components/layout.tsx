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
      <Box
        as="main"
        className="main-content"
        w="full"
        maxW="8xl"
        mx="auto"
        px="12"
      >
        <Box display={{ md: "flex" }}>
          <Sidebar />
          <Box flex="1" minW="0">
            <Box as="main" className={styles.main} pt="12">
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
