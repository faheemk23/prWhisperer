import OpenAI from "openai";

// when I get openAI eky

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

// main();
