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

type Form = {
  username: string;
  token: string;
};

export default function GetGraphs() {
  const [form, setForm] = useState<Form>({
    username: "",
    token: "",
  });
  const [response, setResponse] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: keyof Form
  ) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(
      `https://pixe.la/v1/users/${form.username}/graphs`,
      {
        method: "GET",
        headers: {
          "X-USER-TOKEN": `${form.token}`,
        },
      }
    );

    const graphs = await res.json();
    console.log(graphs);
    setResponse(JSON.stringify(graphs, null, 2));
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
      <Button type="button" colorScheme="teal" onClick={handleSubmit}>
        Submit
      </Button>
      <Code display="block" whiteSpace="pre">
        {response}
      </Code>
    </>
  );
}
