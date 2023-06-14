console.log("Connected to create-post.js client code");

const form = document.getElementById("create-post-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const username = document.getElementById("username").value;

  const post = {
    title,
    content,
    username,
  };

  try {
    const response = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Error creating post");
    }

    const data = await response.json();
    console.log("Post created:", data);
    // Optionally update the UI or provide feedback to the user
  } catch (error) {
    console.error("Error creating post:", error);
    // Handle error and show appropriate feedback to the user
  }
});
