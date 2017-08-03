## TODO
- come up with a different name. 
-- While it might be short, cheeky and maybe a bit offensive, not something I want to keep.

Very alpha, as in it only works for the simplest of cases...

I want it to be a quick command line tool I pull out on occasion to generate dummy data.
For the purpose of possibly stubbing tests, or scaffold like demo to give the client a sense of what it might look like.

`npm i`
`node fkr.js src/basic.json foo.json`

I will probably write a clojurescript version of this later, 
as I think using edn as source would be more terse.

transit-js doesn't support an edn reader, so this might become a rewrite a bit later.
