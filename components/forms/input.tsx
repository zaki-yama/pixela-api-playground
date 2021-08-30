import {
  Input as ChakraUIInput,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Props<TFieldValues extends Record<string, any>> = {
  name: keyof TFieldValues;
  required?: boolean;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
};

export default function Input<TFieldValues>({
  name,
  required,
  register,
  errors,
}: Props<TFieldValues>) {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel htmlFor="username">username</FormLabel>
      <ChakraUIInput
        // @ts-ignore
        id={name}
        type="text"
        // @ts-ignore
        {...register(name, {
          required: required && "This is required.",
        })}
      />
      {/* @ts-ignore */}
      <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
    </FormControl>
  );
}
