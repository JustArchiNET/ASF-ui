<template>
    <main class="main-container main-container--center">
        <div class="container container--small">
            <h2 class="title">Setup</h2>
            <h4 class="subtitle">Before continuing, you need to configure IPC access</h4>

            <div class="form-item">
                <label for="host" class="label">Host</label>
                <input id="host" class="input" type="text" value="localhost:1242">
            </div>

            <div class="form-item">
                <label for="password" class="label">Password</label>
                <input id="password" class="input" type="password">
            </div>

            <div class="form-item">
                <button class="button button--confirm">Continue</button>
            </div>
        </div>
    </main>
</template>

<script>
  export default {
    name: 'setup',
    components: {}
  };
</script>
