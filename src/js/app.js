document.getElementById("fetchUserDataBtn").addEventListener("click", function (event) {
  event.preventDefault();
  var url = "https://jsonplaceholder.typicode.com/users/";
  caches.open("user").then(function (cache) {
    fetch(url)
      .then(response => {
        cache.put(url, response);
      });
    fetch(url).then(response => {
      response.json().then(users => {
        let output = "<h2>Lists of Users</h2>";
        output += "<ul>";
        users.forEach(function (user) {
          output += `
          <li>
              ${user.name}
          </li>
        `;
        });
        output += "</ul>"
        document.getElementById("response").innerHTML = output;
      })
    })
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
} else {
  console.warn("Service workers are not supported in this browser.");
}