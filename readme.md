# Smart Email Field

Smart Email Field adds autocompletion of popular email domains to your inputs.  
Right arrow autocompletes the suggestion.

![Smart Email Field](images/smart-email-field.gif)

## Demo
http://petarslovic.github.io/smart-email-field/

## Dependencies

No dependencies. Vanilla JS.

## Install

### Get the files
  NPM  
    `npm install smart-email-field --save`

  Bower  
    `bower install smart-email-field --save`

### Include the files in your app

```html
  <script src="smart-email-field.min.js"></script>
```

## Usage

**Important - Email fields must have ID attributes, otherwise the plugin won't work as expected.**  

There are a few ways to instantiate the plugin.  
Given a few email fields:

```html
<input type="email" class="email-field">
<input type="email" class="email-field">
<input type="email" id="email-1">
```

#### Via selector
```js
var smartEmail = new SmartEmailField('.email-field')
```
This will make only the first input into a SmartEmailField. SmartEmailField uses `document.querySelector` if you pass a string.

#### Via DOM Element
```js
var emailElement = document.querySelector('#email-1');
var smartEmail1 = new SmartEmailField(emailElement);
```

#### If you are using jQuery
```js
var $email = $('#emial-1');
var smartEmail1 = new SmartEmailField($email.get(0));
// or
var smartEmail1 = new SmartEmailField($email[0]);
```

#### If you have multiple email fields on the page
```js
[].slice.call(document.querySelectorAll('.my-email')).map(el => new SmartEmailField(el));
```

jQuery:
```js
$('.my-email').each($el => new SmartEmailField($el[0]));
```


## Configuration

To configure SmartEmailField, pass options as the second parameter to constructor:
```js
  var myEmail = new SmartEmailField('#my-email', {
    shadowStyle: {
      color: 'rgba(0, 0, 0, 0.3)'
    }
  })
```

#### Options

- **shadowStyle**  
Set the style of the shadow element. This affects the background color of the email field, or the color of autocomplete text, or any other property.

```js
new SmartEmailField('#my-email', {
  shadowStyle: {
    color: 'rgba(0, 0, 0, 0.3)',
    background: 'yellow'
  }
})
```

- **emailDomains**  
Set the list of email domains to use for autocompletion. Use it to override the default list (which can be seen in the plugin, as `EMAIL_DOMAINS` variable).

```js
new SmartEmailField('#my-email', {
  emailDomains: ['gmail.com', 'yahoo.com']
})
```

## How it works

It's pretty simple:  
- we have a email field
- we wrap it with a div
- add a shadow div behind
- copy the styles of email field to shadow div
- make email field's background transparent, so we can see the shadow field
- fill shadow field with suggestion text
