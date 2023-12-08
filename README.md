### raight

a writing editor using llms to provide iterative feedback.

### getting started

- run `npm install` from the root of the project
- setup `.env` using `env-sample`, you'll need a few things
- `npm run dev`
- open `localhost:3000` and create a note
- begin writing, or preferably (because I didn't test much) grab some paragraphs from [the frugal architect](https://thefrugalarchitect.com/laws/make-cost-a-non-functional-requirement.html) and paste them in one by one.
- use the events panel to view the mechanism, some logs in console too, updates are debounced for 1 second as you type and completions can take some time
