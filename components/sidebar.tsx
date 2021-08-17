import { chakra, useColorModeValue, Box, Stack } from "@chakra-ui/react";
import SidebarLink from "./sidebar-link";
import { SidebarCategory } from "./sidebar-category";

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

export default function Sidebar() {
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
