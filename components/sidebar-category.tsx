import { chakra, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function SidebarCategory({ title, children }: Props) {
  return (
    <chakra.div>
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
