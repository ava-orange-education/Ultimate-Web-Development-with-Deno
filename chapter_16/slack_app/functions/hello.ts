import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const HelloFunction = DefineFunction({
  callback_id: "hello_function",
  title: "Hello World",
  description: "A function that says hello",
  source_file: "functions/hello.ts",
  input_parameters: {
    properties: {
      recipient: {
        type: Schema.types.string,
        description: "The name of the recipient",
      },
    },
    required: ["recipient"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "The greeting message",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  HelloFunction,
  ({ inputs }) => {
    const { recipient } = inputs;
    const greeting = `Hello, ${recipient}! Welcome to the Deno-powered Slack platform.`;
    
    return {
      outputs: {
        greeting,
      },
    };
  },
);
