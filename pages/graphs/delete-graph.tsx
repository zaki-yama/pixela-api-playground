import {
  Heading,
  Button,
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
};

const deleteGraph = async (
  username: string,
  token: string,
  graphId: string
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs/${graphId}`,

    {
      method: "DELETE",
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

  return res.json();
};

export default function DeleteGraph() {
  const [form, setForm] = useState<Form>({
    username: "",
    token: "",
    graphId: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof Form
  ) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const { username, token, graphId } = form;
    try {
      const response = await deleteGraph(username, token, graphId);
      console.log(response);
      setResponse(response);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Heading as="h1" size="lg">
        DELETE - /v1/users/&lt;username&gt;/graphs/&lt;graphID&gt;
      </Heading>

      <chakra.p py="4">Delete predefined pixelation graph definition.</chakra.p>

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
          isLoading={isLoading}
          onClick={handleExecute}
        >
          Execute
        </Button>
        {response && (
          <Code display="block" whiteSpace="pre">
            {JSON.stringify(response, null, 2)}
          </Code>
        )}
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
