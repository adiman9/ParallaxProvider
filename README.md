# Parallax Provider

**This is pretty alpha right now, use at your own discretion**

This is a simple library to help create website interactions that rely on
scrolling. This is commonly used in parallax type of websites but it can also be
used for creative art and many other ideas too.

## TODO

- Provide defaults to the module objects so things don't break when a property
  is forgotten.
- Provide a warning when using `mountAfterId` and `mountType: 'absolute'`
  together.
- Allow id to be anything that can be `JSON.stringified`.

## Feature ideas

- [ ] Use a custom html attribute that will tell the library to grab a reference
      to it instead of having to do `document.querySelector` in the client code.
- [ ] Provide built in tweening helpers
- [ ] Ability to add new modules after the library has been instantiated.

## Contributing

I would love for you to get involved and submit a pull request. I think there is
a lot of cool things that could be done with this lib so feel free to hack away
and try things!
