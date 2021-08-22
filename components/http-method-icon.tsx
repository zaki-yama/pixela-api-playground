import { Badge } from "@chakra-ui/react";

type Props = {
  method: string;
};

const COLOR_SCHEMES = {
  GET: "cyan",
  POST: "green",
  PUT: "yellow",
  DELETE: "red",
};

export default function HttpMethodIcon({ method }: Props) {
  const colorScheme =
    COLOR_SCHEMES[method as keyof typeof COLOR_SCHEMES] || "gray";
  return (
    <Badge
      mr="2"
      lineHeight="tall"
      fontSize="10px"
      variant="solid"
      colorScheme={colorScheme}
      minW="3rem"
      textAlign="center"
    >
      {method}
    </Badge>
  );
}
