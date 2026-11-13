import { $, initDialogs, openDialog } from './shared/ui.js';
import { initCatalog } from './features/catalog.js';
import { initShopping } from './features/shopping.js';
import { initGallery } from './features/gallery.js';
import { initComparison } from './features/comparison.js';
import { initNavigation } from './features/navigation.js';
import { initStudio360 } from './features/studio.js';
import { initArchitecture } from './features/architecture.js';

// Modules run after the document is parsed. Render the catalog before binding its controls.
initDialogs();
initCatalog();
initShopping();
initGallery();
initComparison();
initNavigation();
initStudio360();
initArchitecture();

$('#privacy-button').onclick = () => openDialog('#privacy-dialog');
$('#year').textContent = new Date().getFullYear();
