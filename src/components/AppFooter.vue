<template>
    <footer class="footer">
    	<div class="links">
    		<a target="_blank" href="https://github.com/JustArchi/ArchiSteamFarm">GitHub</a>
    	</div>
    </footer>
</template>

<script>
  export default {
    name: 'app-footer'
  };
</script>

<style lang="scss">
    .footer {
        width: 100%;
        height: var(--navigation-height);
        background: white;
        border-top: 1px solid var(--color-border);
        box-sizing: border-box;
    }
    .links {
	    padding: 15px;
    }
    a {
	    color: var(--color-main);
	    font-weight: 700;
	    text-decoration: none;
    }
</style>