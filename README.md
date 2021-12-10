# Advent of Code 2021 in TypeScript

I'm an experienced JavaScript developer but I don't know TypeScript. Let's see what happens when my JavaScript skills collide with dimly remembered statically typed compiled language knowledge! From, like, the nineties!

If you're not familiar, [Advent of Code](https://adventofcode.com) is an enjoyable 25-day programming challenge with something for every level of experience. Some years I finish, other years I'm busy. Always fun.

## How to run these

I did this to get set up:

```
# Typescript compiler
npm install -g typescript
# Typescript command line environment
npm install -g ts-node
# Typescript types for node
npm install -g @types/node
```

Now I can run `ts-node day-1a.ts` to run that solution. In addition I added an alias in my `.bash_profile`:

```
alias ts=ts-node
```

... So I can type `ts day-1a.ts`.

But I should really set up a `package.json` here so you can `npm install` and run these with `npx` and all that jazz so I'm not dependent on a globally installed version of typescript. I can still have my alias, after all.
