import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import {
	faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faPowerOff, faPause, faCogs, faClock,
	faTimesCircle, faCheckCircle, faEdit, faTimes, faSquare, faMoon, faPalette, faPlay, faQuestion, faPlus,
	faSpinner, faKey, faTrash, faCloudDownloadAlt, faSignOutAlt, faAngleDown, faLanguage, faGamepad, faClone,
	faCalendarCheck, faLock, faBook, faExclamation, faCodeBranch
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faWrench, faBars, faLaptop, faUsers, faFileAlt, faTachometerAlt, faPowerOff, faPause, faCogs,
	faClock, faTimesCircle, faCheckCircle, faEdit, faTimes, faSquare, faMoon, faPalette, faPlay, faQuestion,
	faPlus, faSpinner, faKey, faTrash, faCloudDownloadAlt, faSignOutAlt, faAngleDown, faLanguage, faGamepad,
	faClone, faCalendarCheck, faLock, faGithub, faBook, faExclamation, faCodeBranch);

export default {
	install(Vue) {
		Vue.component('font-awesome-icon', FontAwesomeIcon);
	}
};
