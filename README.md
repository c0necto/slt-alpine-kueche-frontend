# 🔥 gatsby site based on headless pimcore

# Document types

In Pimcore, document types are mostly defined by their controller and associated actions. We use this to determine the jsx template to use. For example, the method `defaultAction` of the `App\Controller\DefaultController` would correspond to the template `/components/PageTypes/default.js`. In essence, we remove the class name and the `Action` part of the method and use that as the template name.

# Document editables

Pimcore DataHub returns all document editables in a single list where the name determines the structure of the data.

For example, a document template could look like this:

```twig
<div>
    <h1>My website</h1>
    <h3>{{ pimcore_input("subtitle") }}</h3>
    <header>
        {{pimcore_image('header')}}
    </header>
</div>
```

And if you ran the query (TODO: Add example query) you would get the following elements as a result:

```JS
[
  {
    _editableType: "input",
    _editableName: "subtitle",
    text: "This is the subtitle"
  },
  {
    _editableType: "image",
    _editableName: "header",
    image: {
      id: 15,
      fullpath: "/path/to/image.jpg"
    }
  }
]
```

These would represent a text input and an image and they would be accessible in the template component as props `subtitle` and `header`:

```JS
function DefaultTemplate(props) {
  const { subtitle, header } = props
  return (
    <div>
      <h1>{subtitle}</h1>
      <img src={header.image.fullpath} />
    </div>
  )
}
```

## Areabricks

Areabricks are a type of component that can contain multiple subcomponents. Let's take a quote component as an example. It has a `text` and an `author` editable, as well as an associated image. These get passed as an object prop called `elements` as well as an unstructured list called `children`. Depending on your use case you can choose between either, or use both. This example needs to get editables by their specific names, so `elements.editableName`is the better choice. Vice versa, the `children` prop would be a better choice if you are not sure of the name or count of editables (for example, in a table where you're not sure of the number of columns).

An example component for the `quote` areabrick could look like this and would be located in `/components/Areabricks/QuoteAreabrick.js`:

```JS
function QuoteAreabrick(props) {
  const { elements } = props;
  return (
    <div>
      <h1>Quote by {elements.author.text}</h1>
      <img src={elements.image.fullpath} />
      <p>{elements.text.text}</p>
    </div>
  )
}
```

And the corresponding twig template in Pimcore could look like this:

```twig
<div>
    <h1>Quote by {{ pimcore_input('author')</h1>
    {{pimcore_image('image')}}
    <p>{{ pimcore_input('text') }}</p>
</div>
```

Due to the way the Pimcore DataHub returns the editables (a one-dimensional list), some parsing is needed before the React components can work seamlessly. Let's construct a graphql query to get the document and focus on the areabrick. This could be our query, if we wanted the document situated at `/path/to/document`. Note that we only considered the document types (`Pimcore_document_page`) and editables (`Pimcore_document_editableInput` and `Pimcore_document_editableImage`) which we used in the example. The real query would be much larger (see `/templates/index.js` for an example) and could be extended, depending on whether you define custom editable types (see the Pimcore documentation).

```graphql
query DocumentById($id: Int!) {
  pimcore {
    getDocument(id: $id) {
      __typename
      ...on Pimcore_document_page {
        id
        modificationDate
        title
        description
        controller
        elements {
          __typename
          ...on Pimcore_document_editableInput {
            _editableType
            _editableName
            text
          }
          ...on Pimcore_document_editableImage {
            _editableType
            _editableName
            image {
              fullpath
            }
          }
        }
      }
    }
  }
}
```

The result would look like this:

```JS
const result = {
    pimcore: {
        getDocument: {
            __typename: "Pimcore_document_page",
            id: 1,
            modificationDate: "2019-01-01T00:00:00+00:00",
            title: "My page",
            description: "My page description",
            controller: "App\Controller\PageController::defaultAction",
            elements: [
              /* A list of all editable elements in the document */
            ]
        }
    }
}
```

The `elements` property contains all editables in the document, flattened into a single array. Consider an example areabrick editable on its own, as it would be returned from a `getDocument` graqphql query as an item in the `elements` list:

```JS
[
  {
    _editableType: "areablock",
    _editableName: "quote",
    data: [
      {
        key: "1",
        type: "text"
      },
      {
        key: "2",
        type: "image"
      },
      {
        key: "3",
        type: "text"
      }
    ]
  }
]
```

We can see that it has three "children" in the `data` array. Each of these has their own `type` as well as a unique `key` (`1`, `2` and `3`,  respectively).
Note that the keys are not necessarily sorted and should be kept in the same order as they arrive in. So a `key` of `1` could be the first element in the `data` array, but it could also be the third element. This is fine. Do not rearrange the elements in the `data` array as this will likely break things.

Let's keep expanding our example.
The list above is missing the children, so let's add them:

```JS
[
  {
    _editableType: "areabrick",
    _editableName: "quote",
    data: [
      {
        key: "1",
        type: "text"
      },
      {
        key: "2",
        type: "image"
      },
      {
        key: "3",
        type: "text"
      }
    ]
  },
  {
    _editableName: "quote:1.author",
    _editableType: "text",
    text: "This is the first text"
  },
  {
    _editableName: "quote:2.image",
    _editableType: "image",
    image: {
      id: 15,
      fullpath: "/path/to/image.jpg"
    }
  },
  {
    _editableName: "quote:3.text",
    _editableType: "text",
    text: "This is the third text"
  }
]
```

Take a look at each of the `_editableName` values. The first one is the `_editableName` of the areabrick itself (`content`) and the others represent the `_editableName` of its children.

The children of the `content` areabrick are named `quote:1.author`, `quote:2.image` and `quote:3.text`. As you can imagine, working with this list is a bit more complicated than necessary.

### Transforming the data

So far, we have a list of editables that we can use to render the component but we need to transform the data to a format that is more suitable for React.

The first thing we do is to find the "root" editables - i.e. those that are not children of other editables. This is done by filtering the list of editables and keeping only those that have a `_editableName` that does not contain a `:`.

In the above example we would only have one root editable, the `areabrick` editable. But it could very well be a list of other editables and not just `areabrick` editables. The very first example in this README would be an instance of this.

Anyway, let's focus in on the `data` property of the `quote` areabrick:

```JS
[
  {
    key: "1",
    type: "text"
  },
  {
    key: "2",
    type: "image"
  },
  {
    key: "3",
    type: "text"
  }
]
```

Areabrick editables have a `data` property which contains a list of contained editables.
The transformer simply adds a `children` property to each of these entries. Just like before, this is done by filtering via `_editableName` and then mapping the editables to a `children` property.
For example, to get the (direct) children of the `image`, we would get all the editables that have an `_editableName` that starts with `quote:2.image` and does not contain any more `:` (as would be the case if the `image` editable was another areabrick).

In addition, the transformer adds a `name` property to the `children` to make it easier to access them.

If we finish the example, we end up with the following structure:

```JS
[
  {
    _editableType: "areabrick",
    _editableName: "quote",
    data: [
      {
        key: "1",
        type: "text",
        children: [
          {
            _editableName: "quote:1.author",
            name: "author",
            _editableType: "text",
            text: "This is the first text"
          }
        ]
      },
      {
        key: "2",
        type: "image",
        children: [
          {
            _editableName: "quote:2.image",
            name: "image",
            _editableType: "image",
            image: {
              id: 15,
              fullpath: "/path/to/image.jpg"
            }
          }
        ]
      },
      {
        key: "3",
        type: "text",
        children: [
          {
            _editableName: "quote:3.text",
            name: "text",
            _editableType: "text",
            text: "This is the third text"
          }
        ]
      }
    ]
  }
]
```

## Areabricks in Templates

Areabricks are pretty much automatically handled by the `AreabrickList` component and you don't need to worry about the data structure. Let's say we want to render a list of Areablocks named `content` (as we do in the default template). This would look somewhat like this:

```JS
const DefaultTemplate = (props) => {
  const { content } = props

  return (
    <>
      <h1>Other template things. Maybe render a page title here</h1>
      <AreabrickList {...content} document={document} />
    </>
  )
}
```

## Areabricks in Areabricks

Nested areablocks are exactly the same, except for the way the data is passed. While templates receive the elements directly as props (i.e. you can access `props.content` to get the `content` editable), the areabricks component receives the sub-elements as a prop called `elements` (so the `content` editable can be found in `props.elements.content`).

Assume we had an areabrick with a nested areabrick stored in `myBrick`, like in this twig template (`/templates/areas/demo/view.html.twig`).

```HTML
<div>
    {{ pimcore_input('title') }}
    {{ pimcore_areablock('myBrick') }}
</div>
```

If we wanted to render it, we would have to do something like this. Notice how `pimcore_areablcok` corresponds to `<AreabrickList />`. This could eventually change to reflect the actual Pimcore naming.

```JS
import React from 'react';
import AreabrickList from '~components/Areabricks/AreabrickList';

function DemoAreabrick(props) {
  const { elements } = props;
  
  return (
    <div>
      <h1>{ elements.title.text }</h1>
      <AreabrickList {...elements.myBrick} />
    </div>
  );
}
```

Depending on the areabricks you might end up with a jsx/html structure like the following. By sheer luck, this example uses the `DefaultTemplate` and only contains the `quote` and `demo` areabricks we defined earlier:

```JS
// This is the html/jsx output of an example DefaultTemplate as defined above
<DefaultTemplate>
    <h1>Other template things. Maybe render a page title here</h1>
  
    <AreabrickList>
        <QuoteAreabrick>
            <div>
                <h2>{elements.author.text}</h2>
                <img src={elements.image.fullpath} />
                <p>{elements.text.text}</p>
            </div>
        </QuoteAreabrick>
      
        <DemoAreabrick>
            <div>
                <h1>The title</h1>
              
                <AreabrickList>
                      <QuoteAreabrick>
                            <div>
                                  <h2>{elements.author.text}</h2>
                                  <img src={elements.image.fullpath} />
                                  <p>{elements.text.text}</p>
                            </div>
                      </QuoteAreabrick>

                      <DemoAreabrick>
                          <div>
                              <h1>The title</h1>
                              <AreabrickList>
                                
                                  {/* Even more areabricks would go here */}
                                
                              </AreabrickList>
                          </div>
                      </DemoAreabrick>
                  
                      {/* Another few areabricks could go here */}
                  
                </AreabrickList>
            </div>
        </DemoAreabrick>
      
        {/* Here we could also have more areabricks */}
      
    </AreabrickList>
</DefaultTemplate>
```

