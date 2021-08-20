import { chakra, Heading, Flex } from "@chakra-ui/react";

export default function Header() {
  return (
    <chakra.header
      pos="sticky"
      top="0"
      height="4.5rem"
      zIndex={1}
      bg="gray.200"
    >
      <Flex w="100%" h="100%" align="center" px="6">
        <Heading>Pixela API Playground</Heading>
      </Flex>
    </chakra.header>
  );
}
