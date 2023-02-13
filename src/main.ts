import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import { destinyDataService, selectionService } from './data/services'

selectionService.preferencesLoaded.then(async () => {
    const language = selectionService.language;
    await destinyDataService.initialize(language);
});

createApp(App).mount('#app')
