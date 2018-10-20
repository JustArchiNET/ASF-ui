import { library } from '@fortawesome/fontawesome-svg-core';

import {
	faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faHome, faPowerOff, faPause, faCogs, faClock,
	faTimesCircle, faCheckCircle, faEdit, faTimes, faSquare, faMoon, faPalette, faPlay, faQuestion, faPlus, faSpinner,
	faKey, faTrash, faCloudDownloadAlt, faSignOutAlt, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

library.add(faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faHome, faPowerOff, faPause, faCogs, faClock,
	faTimesCircle, faCheckCircle, faEdit, faTimes, faSquare, faMoon, faPalette, faPlay, faQuestion, faPlus, faSpinner,
	faKey, faTrash, faCloudDownloadAlt, faSignOutAlt, faInfoCircle);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
	install(Vue) {
		Vue.component('font-awesome-icon', FontAwesomeIcon);
	}
}
