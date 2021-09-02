import Image from "next/image";
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
        <Image src="/logo.png" alt="" width="32px" height="32px" />
        <Heading pl="2">Pixela API Playground</Heading>
      </Flex>
    </chakra.header>
  );
}
