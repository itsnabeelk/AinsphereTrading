import { Routes } from '@angular/router';
import { GeneralLayout } from './layouts/general-layout/general-layout';
import { GeneralHome } from './layouts/general-layout/general-home/general-home';
import { ContactUs } from './contact-us/contact-us';
import { Career } from './career/career';
import { GeneralAbout } from './layouts/general-layout/general-about/general-about';
import { GeneralServices } from './layouts/general-layout/general-services/general-services';
import { GeneralServiceDetails } from './layouts/general-layout/general-service-details/general-service-details';

export const routes: Routes = [
    {
        path: 'contact-us',
        component: ContactUs,
    },
    {
        path: 'career',
        component: Career,
    },
    {
        path: '',
        component: GeneralLayout,
        children: [
            { path: '', component: GeneralHome },
            { path: 'general-trading', component: GeneralHome },
            { path: 'general-about', component: GeneralAbout },
            { path: 'general-services', component: GeneralServices },
            { path: 'general-details', component: GeneralServiceDetails }
        ]
    },
];

