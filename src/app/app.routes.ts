import { Routes } from '@angular/router';
import { GeneralLayout } from './layouts/general-layout/general-layout';
import { GeneralHome } from './layouts/general-layout/general-home/general-home';
import { ContactUs } from './contact-us/contact-us';
import { Career } from './career/career';
import { GeneralAbout } from './layouts/general-layout/general-about/general-about';
import { GeneralServices } from './layouts/general-layout/general-services/general-services';
import { GeneralServiceDetails } from './layouts/general-layout/general-service-details/general-service-details';
import { FmcgLayout } from './layouts/fmcg-layout/fmcg-layout';
import { FmcgHome } from './layouts/fmcg-layout/fmcg-home/fmcg-home';
import { FmcgServices } from './layouts/fmcg-layout/fmcg-services/fmcg-services';
import { FmcgServiceDetails } from './layouts/fmcg-layout/fmcg-service-details/fmcg-service-details';
import { MepLayout } from './layouts/mep-layout/mep-layout';
import { MepHome } from './layouts/mep-layout/mep-home/mep-home';
import { MepServices } from './layouts/mep-layout/mep-services/mep-services';
import { MepServiceDetails } from './layouts/mep-layout/mep-service-details/mep-service-details';
import { UniformLayout } from './layouts/uniform-layout/uniform-layout';
import { UniformHome } from './layouts/uniform-layout/uniform-home/uniform-home';
import { UniformServices } from './layouts/uniform-layout/uniform-services/uniform-services';
import { UniformServiceDetails } from './layouts/uniform-layout/uniform-service-details/uniform-service-details';

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
    {
        path: '',
        component: FmcgLayout,
        children: [
            { path: '', component: FmcgHome },
            { path: 'fmcg-home', component: FmcgHome },
            { path: 'fmcg-services', component: FmcgServices },
            { path: 'fmcg-service-details', component: FmcgServiceDetails },
        ]
    },
    {
        path: '',
        component: MepLayout,
        children: [
            { path: '', component: MepHome },
            { path: 'mep-home', component: MepHome },
            { path: 'mep-services', component: MepServices },
            { path: 'mep-service-details', component: MepServiceDetails },
        ]
    },
    {
        path: '',
        component: UniformLayout,
        children: [
            { path: '', component: UniformHome },
            { path: 'uniform-home', component: UniformHome },
            { path: 'uniform-services', component: UniformServices },
            { path: 'uniform-service-details', component: UniformServiceDetails },
        ]
    }
];

