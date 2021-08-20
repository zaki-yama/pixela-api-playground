import { Box, Stack } from "@chakra-ui/react";
import SidebarLink from "./sidebar-link";
import SidebarCategory from "./sidebar-category";
import HttpMethodIcon from "./http-method-icon";

import routes from "./routes.json";

export default function Sidebar() {
  return (
    <Box
      as="nav"
      aria-label="Main Navigation"
      pos="sticky"
      top="4.5rem"
      w="280px"
      h="calc(100vh - 8.125rem)"
      pr="8"
      pb="6"
      pl="6"
      pt="4"
      overflowY="auto"
      flexShrink={0}
    >
      {routes.map((category, index) => {
        return (
          <SidebarCategory
            key={category.path}
            title={category.title}
            // selected={selected}
            // opened={opened}
          >
            <Stack as="ul">
              {category.routes.map((route) => (
                <SidebarLink
                  as="li"
                  key={route.path}
                  href={route.path}
                  method={route.method}
                >
                  <HttpMethodIcon method={route.method} />
                  <span>{route.title}</span>
                </SidebarLink>
              ))}
            </Stack>
          </SidebarCategory>
        );
      })}
    </Box>
  );
}
