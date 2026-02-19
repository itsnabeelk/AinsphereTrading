import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GeneralLayout } from './layouts/general-layout/general-layout';
import { GeneralHome } from './layouts/general-layout/general-home/general-home';
import { ContactUs } from './contact-us/contact-us';
import { Career } from './career/career';
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
        path: 'login',
        redirectTo: 'dashboard/login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./dashboard-layout/dashboard-login/login/login')
                        .then(m => m.Login)
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./dashboard-layout/dashboard-login/reset-password/reset-password')
                        .then(m => m.ResetPassword)
            },
            {
                path: '',
                canActivate: [AuthGuard],
                loadComponent: () =>
                    import('./dashboard-layout/layout/dashboard-layout')
                        .then(m => m.DashboardLayout),
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/dashboard-home/dashboard-home')
                                .then(m => m.DashboardHome)
                    },
                    {
                        path: 'profile',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/profile/profile')
                                .then(m => m.Profile)
                    },
                    {
                        path: 'general-dashboard-home',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/general-home/general-home')
                                .then(m => m.GeneralHome)
                    },
                    {
                        path: 'general-service-detail/:id',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/general-home/general-service-detail/general-service-detail')
                                .then(m => m.GeneralServiceDetail)
                    },
                    {
                        path: 'fmcg-dashboard-home',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/fmcg-dashboard-home/fmcg-dashboard-home')
                                .then(m => m.FmcgDashboardHome)
                    },
                    {
                        path: 'fmcg-service-detail/:id',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/fmcg-dashboard-home/fmcg-service-detail/fmcg-service-detail')
                                .then(m => m.FmcgServiceDetail)
                    },
                    {
                        path: 'mep-dashboard-home',
                        loadComponent: () =>
                            import('./dashboard-layout/pages/mep-dashboard-home/mep-dashboard-home')
                                .then(m => m.MepDashboardHome)
                    },

                ]
            }
        ]
    },


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

            // LIST PAGE
            { path: 'general-services', component: GeneralServices },

            // DETAIL PAGE (SLUG BASED)
            { path: 'general-services/:slug', component: GeneralServiceDetails },
        ]
    },
    {
        path: '',
        component: FmcgLayout,
        children: [
            { path: '', component: FmcgHome },

            { path: 'fmcg-home', component: FmcgHome },

            { path: 'fmcg-services', component: FmcgServices },

            { path: 'fmcg-services/:slug', component: FmcgServiceDetails }
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

