This project contains a basic React template with better auth, drizzle, trpc and whatnot. Use it to create a React app, a pastebin clone called txtshr.

The homepage of the app will contain a form for authorized and anonymous users to add new text, which will contain title field, content field and visibility field ("public" | "unlisted" | "private" - only for logged users)

Homepage will also have a view of all recent public texts paginated, with their title, by which user it was submitted, and how long ago it was, clicking the card will redirect to a route /txt/unique-id.

There is a dynamic route called /txt/[id] which will present in a nice way the content and title.
