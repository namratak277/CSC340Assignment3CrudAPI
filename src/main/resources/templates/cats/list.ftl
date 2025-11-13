<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cats - List</title>
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <header>
    <h1><a href="/web/cats">Cats App</a></h1>
    <nav><a href="/web/cats/new">Add New Cat</a></nav>
  </header>

  <section>
    <form method="get" action="/web/cats">
      <input type="text" name="name" placeholder="Search by name" value="${searchName!}">
      <button type="submit">Search</button>
    </form>
  </section>

  <section>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Breed</th>
          <th>Age</th>
          <th>Color</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <#list cats as c>
        <tr>
          <td>${c.animalId}</td>
          <td>${c.name}</td>
          <td>${c.description}</td>
          <td>${c.breed!}</td>
          <td>${c.age?string("0.0")}</td>
          <td>${c.color!}</td>
          <td>
            <a href="/web/cats/${c.animalId}/edit">Edit</a>
            <form method="post" action="/web/cats/${c.animalId}/delete" style="display:inline">
              <button type="submit" onclick="return confirm('Delete this cat?')">Delete</button>
            </form>
          </td>
        </tr>
        </#list>
      </tbody>
    </table>
  </section>
</body>
</html>
