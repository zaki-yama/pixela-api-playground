import { Heading, Button, Stack, chakra } from "@chakra-ui/react";
import Input from "../../components/forms/input";
import { useForm } from "react-hook-form";

import Layout from "../../components/layout";

type FormData = {
  username: string;
};

export default function GetProfile() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = () => {
    window.open(`https://pixe.la/@${getValues().username}`);
  };

  console.log(errors);
  return (
    <Layout>
      <Heading as="h1" size="lg">
        GET - /@&lt;username&gt;
      </Heading>

      <chakra.p py="4">
        Outputs the profile of the user specified by <code>username</code> in
        html format.
      </chakra.p>

      <Heading size="md" py="4">
        Request parameters
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input name="username" required register={register} errors={errors} />
          <Button type="submit" colorScheme="teal">
            Open profile page
          </Button>
        </Stack>
      </form>
    </Layout>
  );
}
