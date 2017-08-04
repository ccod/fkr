## TODO
- come up with a different name. 
  - While it might be short, cheeky and maybe a bit offensive, not something I want to keep.

Very alpha, probably only works for me... until it doesn't.

I am basically just leveraging [FakerJS](https://github.com/marak/Faker.js/). 

I want it to be a quick command line tool I pull out on occasion to generate dummy data.
For the purpose of possibly stubbing tests, or scaffold like demo to give the client a sense of what it might look like.


`npm i -g`

`fkr src/basic.json foo.json`

If you are on windows, all hope is lost. As in -g probably does nothing for you.

I might find myself writing a ClojureScript version of this thing if only to point it at edn data.
