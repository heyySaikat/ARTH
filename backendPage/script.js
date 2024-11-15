let auth0Client = null;

      // Initialize Auth0 client
      async function initializeAuth0() {
        auth0Client = await createAuth0Client({
          domain: "sagniksarkar.jp.auth0.com", // Replace with your Auth0 domain, e.g., 'dev-12345.auth0.com'
          client_id: "2i7pKcFsjbzzjPHYiE1IVmDYtLK90byz", // Replace with your Auth0 client ID
          redirect_uri: "http://localhost:3000/callback", // Ensure this matches your Allowed Callback URL in Auth0
        });

        // Check if the user is authenticated
        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();
          showUserInfo(user);
        } else {
          console.log("User not authenticated");
        }
      }

      // Show user information
      function showUserInfo(user) {
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("userName").innerText = user.name;
        document.getElementById("userEmail").innerText = user.email;

        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "block";
      }

      // Handle login
      document
        .getElementById("loginBtn")
        .addEventListener("click", async () => {
          await auth0Client.loginWithRedirect();
        });

      // Handle logout
      document.getElementById("logoutBtn").addEventListener("click", () => {
        auth0Client.logout({ returnTo: window.location.origin });
      });

      // Handle the redirect callback
      window.addEventListener("load", async () => {
        if (window.location.search.includes("code=")) {
          // Handle the redirect callback
          await auth0Client.handleRedirectCallback();
          window.location.replace(window.location.pathname);
        }

        // Initialize Auth0 and check authentication
        await initializeAuth0();
      });