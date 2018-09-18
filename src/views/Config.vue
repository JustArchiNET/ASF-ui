<template>
    <main class="main-container">
        <h2 class="title">Config Editor</h2>

        <div class="container">
            <config-editor :fields="fields" :model="model"></config-editor>
        </div>
    </main>
</template>

<script>
  import ConfigEditor from '../components/ConfigEditor.vue';

  export default {
    name: 'Config',
    metaInfo: { title: 'Config' },
    components: { ConfigEditor },
    data() {
      return {
        fields: [
          { defaultValue: null, paramName: 'SteamLogin', type: 'string' },
          { defaultValue: false, paramName: 'AcceptGifts', type: 'boolean' },
          { defaultValue: 3, paramName: 'HoursUntilCardDrops', type: 'smallNumber' },
          { defaultValue: 0, paramName: 's_SteamMasterClanID', type: 'bigNumber' },
          {
            defaultValue: 0,
            paramName: 'BotBehaviour',
            type: 'flag',
            values: {
              None: 0,
              RejectInvalidFriendInvites: 1,
              RejectInvalidTrades: 2,
              RejectInvalidGroupInvites: 4,
              DismissInventoryNotifications: 8,
              MarkReceivedMessagesAsRead: 16,
              All: 31
            }
          },
          {
            defaultValue: 0,
            paramName: 'PasswordFormat',
            type: 'enum',
            values: { PlainText: 0, AES: 1, ProtectedDataForCurrentUser: 2 }
          },
          {
            defaultValue: [0, 1],
            paramName: 'FarmingOrders',
            type: 'hashSet',
            values: {
              type: 'enum',
              values: { Unordered: 0, AppIDsAscending: 1, AppIDsDescending: 2 }
            }
          },
          {
            defaultValue: [],
            paramName: "GamesPlayedWhileIdle",
            type: "hashSet",
            values: { type: 'number' }
          }
        ],
        model: {}
      };
    }
  };
</script>