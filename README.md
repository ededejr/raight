### raight

a writing editor using llms to provide iterative feedback.

### getting started

- run `npm install` from the root of the project
- setup `.env` using `env-sample`, you'll need a few things
- ensure you have your assistants setup in OpenAI. you use the provided [custom instructions](./assistant-custom-instructions/jorja.json)
- `npm run dev`
- open `localhost:3000` and create a note
- begin writing, or preferably (because I didn't test much) grab some paragraphs from [the frugal architect](https://thefrugalarchitect.com/laws/make-cost-a-non-functional-requirement.html) and paste them in one by one.
- use the events panel to view the mechanism, some logs in console too, updates are debounced for 2 seconds and the assistant is a little slow so paste and wait for bubbles to show up at the bottom right before pasting the next paragraph
