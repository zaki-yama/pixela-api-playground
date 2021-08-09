import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Code,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import useSWR from "swr";

type Form = {
  username: string;
  token: string;
};

const fetcher = (method: string, url: string, token: string) =>
  fetch(
    `https://pixe.la/v1/users${url}`,

    {
      method,
      headers: {
        "X-USER-TOKEN": token,
      },
    }
  ).then((res) => res.json());

export default function GetGraphs() {
  const [form, setForm] = useState<Form>({
    username: "",
    token: "",
  });
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    isValidating,
    data: graphs,
    error,
  } = useSWR(
    shouldFetch ? ["GET", `/${form.username}/graphs`, form.token] : null,
    fetcher
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof Form
  ) => {
    setShouldFetch(false);
    setForm({ ...form, [key]: event.target.value });
  };

  const handleSubmit = () => {
    setShouldFetch(true);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          onChange={(e) => handleChange(e, "username")}
          value={form.username}
        />
        <FormLabel>Token</FormLabel>
        <Input
          type="text"
          onChange={(e) => handleChange(e, "token")}
          value={form.token}
        />
      </FormControl>
      <Button
        type="button"
        colorScheme="teal"
        isLoading={isValidating}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      <Code display="block" whiteSpace="pre">
        {JSON.stringify(graphs, null, 2)}
      </Code>
    </>
  );
}
