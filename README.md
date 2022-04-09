This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Overview

This is a Contentful App that provides a custom field to manage lists of annotated references to other entries.

- Data is stored in JSON format.
- Each list contains a title and a list of items.
- Each item is an association of an entry reference (as an ID) and a text annotating the referenced entry.
- You can reorder the items within a list via drag and drop.
- You can add multiple lists.

This was primarily developped to manage multiple lists of ingredients with their amounts for cooking recipes.

## Data structure

This field's data looks like:

```json
[
  {
    "key": "a unique string (UUID)",
    "title": "Title of list 1",
    "items": [
      {
        "key": "a unique string (UUID)",
        "referenceId": "The ID of an entry",
        "text": "Arbitrary text associated to the referenced entry (examples: 100g, a teaspoon)"
      },
      {
        "key": "",
        "referenceId": "",
        "text": "",
      }
    ]
  },
  {
    "key": "a unique string (UUID)",
    "title": "Title of list 2",
    "items": [
      ...
    ]
  }
]
```

## Setup the App in Contentful

1. Build and configure the app [like you would usually do](docs/create-contentful-app.md).
2. In the app definition, under "Location", check "Entry field" and "JSON Object".
3. Under "Instance Parameters Definition", add 2 instance parameters as described here:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `textLabel`| Short text | Used as a placeholder for the text input fields that annotate the referenced entries | `"Text"` |
| `contentTypes` | Short text | A comma separated list of content types that can be referenced (empty means all content types are allowed) | `""` |

4. Save the app definition and activate the app in the Spaces where needed.
5. You should now be able to select this app in the "Appearance" tab when you configure a JSON field. You just need to configure the parameters, or leave them empty to use the defaults.