<template>
  <div class="container">
    <nav>
      <router-link to="/">
        Home
      </router-link>
    </nav>
  </div>
  <main class="container">
    <router-view />
  </main>
  <footer class="m-3">
    <p>
      Example drug editor built by <a href="mailto:brent@focused-light.net">Mcshaz</a>
    </p>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
