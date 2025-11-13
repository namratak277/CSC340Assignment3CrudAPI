<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${(isNew?then('Add New Cat','Edit Cat'))}</title>
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <header>
    <h1><a href="/web/cats">Cats App</a></h1>
  </header>

  <section>
    <form method="post" action="${(isNew? '/web/cats' : '/web/cats/' + cat.animalId)}">
      <div>
        <label for="name">Name</label>
        <input id="name" name="name" type="text" value="${cat.name!}" required />
      </div>
      <div>
        <label for="description">Description</label>
        <input id="description" name="description" type="text" value="${cat.description!}" required />
      </div>
      <div>
        <label for="breed">Breed</label>
        <input id="breed" name="breed" type="text" value="${cat.breed!}" />
      </div>
      <div>
        <label for="age">Age</label>
        <input id="age" name="age" type="number" step="0.1" value="${cat.age?string('0.0')}" />
      </div>
      <div>
        <label for="color">Color</label>
        <input id="color" name="color" type="text" value="${cat.color!}" />
      </div>
      <div>
        <button type="submit">${(isNew? 'Create' : 'Update')}</button>
        <a href="/web/cats">Cancel</a>
      </div>
    </form>
  </section>
</body>
</html>
