import {
  Heading,
  Button,
  Input,
  RadioGroup,
  Radio,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Code,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
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
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      token: "",
      id: "",
      name: "",
      unit: "",
      type: "int",
      color: "shibafu",
    },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<any>(null);

  const onSubmit = async () => {
    const { username, token, ...body } = getValues();
    try {
      const response = await postGraph(username, token, body);
      console.log(response);
      setResponse(response);
      setError(null);
    } catch (error) {
      setError(error);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">username</FormLabel>
            <Input
              id="username"
              type="text"
              {...register("username", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.token}>
            <FormLabel htmlFor="token">token</FormLabel>
            <Input
              id="token"
              type="text"
              {...register("token", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.token && errors.token.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.id}>
            <FormLabel htmlFor="id">id</FormLabel>
            <Input
              id="id"
              type="text"
              {...register("id", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.id && errors.id.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">name</FormLabel>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.unit}>
            <FormLabel htmlFor="unit">unit</FormLabel>
            <Input
              id="unit"
              type="text"
              {...register("unit", {
                required: "This is required.",
              })}
            />
            <FormErrorMessage>
              {errors.unit && errors.unit.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>type</FormLabel>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => {
                return (
                  <RadioGroup onChange={onChange} value={value}>
                    <Stack spacing={4} direction="row">
                      <Radio value="int">int</Radio>
                      <Radio value="float">float</Radio>
                    </Stack>
                  </RadioGroup>
                );
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>color</FormLabel>
            <Select
              {...register("color", {
                required: "This is required",
              })}
            >
              <option value="shibafu">shibafu (green)</option>
              <option value="momiji">momiji (red)</option>
              <option value="sora">sora (blue)</option>
              <option value="ichou">ichou (yellow)</option>
              <option value="ajisai">ajisai (purple)</option>
              <option value="kuro">kuro (black)</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Execute
          </Button>
        </Stack>
      </form>
      <Heading size="md" pt="12" pb="4">
        Response
      </Heading>
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
    </Layout>
  );
}
