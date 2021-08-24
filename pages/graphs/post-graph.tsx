import {
  Heading,
  Button,
  Input,
  RadioGroup,
  Radio,
  Select,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

import Layout from "../../components/layout";

type Form = {
  username: string;
  token: string;

  id: string;
  name: string;
  unit: string;
  type: "int" | "float";
  color: "shibafu" | "momiji" | "sora" | "ichou" | "ajisai" | "kuro";
  timezone?: string;
  selfSufficient?: string;
  isSecret?: boolean;
  publishOptionalData?: boolean;
};

const postGraph = async (
  username: string,
  token: string,
  body: Record<string, any>
) => {
  const res = await fetch(
    `https://pixe.la/v1/users/${username}/graphs`,

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-TOKEN": token,
      },
      body: JSON.stringify(body),
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

export default function PostGraph() {
  const [form, setForm] = useState<Form>({
    username: "",
    token: "",
    id: "",
    name: "",
    unit: "",
    type: "int",
    color: "shibafu",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof Form
  ) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const handleRadioChange = (value: String, key: keyof Form) => {
    setForm({ ...form, [key]: value });
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const { username, token, ...body } = form;
    try {
      const response = await postGraph(username, token, body);
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
        POST - /v1/users/&lt;username&gt;/graphs
      </Heading>

      <chakra.p py="4">Create a new pixelation graph definition.</chakra.p>

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
          <FormLabel>id</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "id")}
            value={form.id}
          />
        </FormControl>
        <FormControl>
          <FormLabel>name</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "name")}
            value={form.name}
          />
        </FormControl>
        <FormControl>
          <FormLabel>unit</FormLabel>
          <Input
            type="text"
            onChange={(e) => handleChange(e, "unit")}
            value={form.unit}
          />
        </FormControl>
        <FormControl>
          <FormLabel>type</FormLabel>
          <RadioGroup
            onChange={(value) => handleRadioChange(value, "type")}
            value={form.type}
          >
            <Stack spacing={4} direction="row">
              <Radio value="int">int</Radio>
              <Radio value="float">float</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>color</FormLabel>
          <Select onChange={(e) => handleChange(e, "color")} value={form.color}>
            <option value="shibafu">shibafu (green)</option>
            <option value="momiji">momiji (red)</option>
            <option value="sora">sora (blue)</option>
            <option value="ichou">ichou (yellow)</option>
            <option value="ajisai">ajisai (purple)</option>
            <option value="kuro">kuro (black)</option>
          </Select>
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
