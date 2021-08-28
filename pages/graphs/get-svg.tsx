import {
  Heading,
  Button,
  Box,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import useSWR from "swr";

import Layout from "../../components/layout";

type Form = {
  username: string;
  token: string;

  graphId: string;
  date?: string;
  mode?: "short" | "badge" | "line";
  appearance?: "dark";
};

const fetcher = async (method: string, url: string, token: string) => {
  const res = await fetch(
    `https://pixe.la/v1/users${url}`,

    {
      method,
      headers: {
        "X-USER-TOKEN": token,
      },
    }
  );
  if (!res.ok) {
    // TODO: define custom error
    const error = new Error("API request failed");
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.text();
};

export default function GetSvg() {
  const [form, setForm] = useState<Form>({
    username: "",
    token: "",
    graphId: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    isValidating,
    data: svg,
    error,
  } = useSWR(
    shouldFetch
      ? ["GET", `/${form.username}/graphs/${form.graphId}`, form.token]
      : null,
    fetcher
  );
  console.log(error);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof Form
  ) => {
    setShouldFetch(false);
    setForm({ ...form, [key]: event.target.value });
  };

  const handleExecute = () => {
    setShouldFetch(true);
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;
      </Heading>

      <chakra.p py="4">
        Based on the registered information, express the graph in SVG format
        diagram.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>username</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "username")}
            value={form.username}
          />
        </FormControl>
        <FormControl>
          <FormLabel>token</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "token")}
            value={form.token}
          />
        </FormControl>
        <FormControl>
          <FormLabel>graphId</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "graphId")}
            value={form.graphId}
          />
        </FormControl>
        <Button
          type="button"
          colorScheme="teal"
          isLoading={isValidating}
          onClick={handleExecute}
        >
          Execute
        </Button>
        {svg && <Box py={12} dangerouslySetInnerHTML={{ __html: svg }}></Box>}
        {error && (
          <>
            <Alert status="error">
              <AlertIcon />
              {error.status}
            </Alert>
            <Code colorScheme="red" display="block" whiteSpace="pre">
              {JSON.stringify(error.info, null, 2)}
            </Code>
          </>
        )}
      </Stack>
    </Layout>
  );
}
