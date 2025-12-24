# BrianGPT

This is a custom, self-hostable front end I made around the OpenAI API to serve as a custom ChatGPT interface.

## Motivation

At the outset of this project, I was hoping to accomplish a few things:

1. Get pay-as-you-go access to the 'latest and greatest' OpenAI models.

   The alternatives are either limited access to the latest model with the free tier or pay $20 / month.

2. More controlled output through custom instructions.

   I used to get so frustrated by the lengthy responses ChatGPT would give me! So much fluff—even when explicitly asking for concise responses!

   Using this tool, I have noticed that, by default, responses are pretty much just as long as I'd expect them to be, without any prompting.

3. Intentionally temporary knowledge.

   I pretty much used the "temporary chat" feature exclusively when using ChatGPT. Recently, I've come to realize that hoarding knowledge—as recommended by the _personal knowledge management_/_second brain_ community—doesn't do my intuition any good. This probably deserves a longer blog post, but TL; DR: I've written `BrianGPT` such that conversations are **intentionally temporary**.

   Conversation history is stored exclusively by the browser and the associated tab.

## Security

`BrianGPT` is set up such that only I can access it ([at least where I have it deployed](https://gpt.balonso.com)). Using GitHub Oauth and AuthJS, only GitHub accounts matching my email (an environment variable) are admitted.

## BrianGPT in Action

Look at the pretty LaTeX rendering!

![Pretty LaTeX rendering!](/docs/pics/math.png)

And check out the pretty code blocks!

![Pretty code blocks!](/docs/pics/code.png)
