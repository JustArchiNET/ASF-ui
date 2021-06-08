# User input

When running ASF in non-interactive environment, most likely with [Headless](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration#headless) global config property set to `true`, ASF-ui can be used for providing required account credentials for ASF to operate.

You can achieve that in 2 different ways:
1. Using `input` [command](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Commands) on Commands page.
2. Pressing Start button on bot's card with "Requires input" status, which will open window with input field, if you didn't input missing data before starting the bot for the first time with `input` [command](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Commands).

# Notifications

1. Clicking on the "There's a new release available" notification will redirect you to the "Releases" page.

2. Clicking on the "New release available! Trying to update..." notification will redirect you to the "Log" page.

# Bots page

Clicking on each of the status tiles in the navigation bar will sort your bots view. If you, for example, only want to see bots that are online, click on the status tile "Online". A green glow will indicate that your view is being filtered.

# Commands page

### Shortcuts

1. `CTRL + A`: moves the cursor to the start of the curent line.

2. `CTRL + K`: removes all characters after the cursor position to the end of the line.

3. `CTRL + L`: clears the entire terminal output.

### Commands

1. `clear`: clears the entire terminal output.

2. `commands`: lists all available commands.

3. `help <command>`: displays a short description of the command.

### Miscellaneous

1. Single press on the Tab key autocompletes currently suggested command or command argument.

2. Double press on the Tab key writes "commands" in the input, if it's empty.

3. Clicking on the ">" symbol next to your command executes it.
