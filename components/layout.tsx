import { Box, Stack, chakra, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import styles from "./layout.module.css";

import SidebarLink from "./sidebar-link";

function SidebarContent() {
  return (
    <>
      <chakra.h4
        fontSize="sm"
        fontWeight="bold"
        my="1.25rem"
        textTransform="uppercase"
        letterSpacing="wider"
        color={useColorModeValue("gray.700", "inherit")}
      >
        User
      </chakra.h4>
    </>
  );
}
type SidebarCategoryProps = {
  title: string;
  children: ReactNode;
};

function SidebarCategory({ title, children }: SidebarCategoryProps) {
  return (
    <chakra.div mt="8">
      <chakra.p
        width="full"
        textTransform="uppercase"
        letterSpacing="wider"
        fontSize="xs"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        userSelect="none"
        color={useColorModeValue("gray.500", "inherit")}
        // onClick={onClick}
      >
        {title}
      </chakra.p>
      <chakra.div role="group" mt="16px" mx="-3">
        {children}
      </chakra.div>
    </chakra.div>
  );
}

function Sidebar() {
  const routes = [
    {
      title: "GET /graphs",
      path: "/get-graphs",
    },
    {
      title: "POST /graphs",
      path: "/post-graphs",
    },
  ];

  return (
    <Box
      as="nav"
      aria-label="Main Navigation"
      pos="sticky"
      top="6.5rem"
      w="280px"
      h="calc(100vh - 8.125rem)"
      pr="8"
      pb="6"
      pl="6"
      pt="4"
      overflowY="auto"
      flexShrink={0}
    >
      <SidebarContent />
      <SidebarCategory
        // key={lvl2.path + index}
        title="foo"
        // selected={selected}
        // opened={opened}
      >
        <Stack as="ul">
          {routes.map((route) => (
            <SidebarLink as="li" key={route.path} href={route.path}>
              <span>{route.title}</span>
              {/*
              {lvl3.new && (
                <Badge
                  ml="2"
                  lineHeight="tall"
                  fontSize="10px"
                  variant="solid"
                  colorScheme="purple"
                >
                  New
                </Badge>
              )}
              */}
            </SidebarLink>
          ))}
        </Stack>
      </SidebarCategory>
    </Box>
  );
}

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box as="main" className="main-content" w="full" maxW="8xl" mx="auto">
      <Box display={{ md: "flex" }}>
        <Sidebar />
        <Box flex="1" minW="0">
          <main className={styles.main}>{children}</main>
        </Box>
      </Box>
    </Box>
  );
}
