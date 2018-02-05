import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';

export const homeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: 'app/home/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'advertising/campaigns',
                loadChildren: 'app/home/campaigns/campaigns.module#CampaignsModule'
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            }
        ]
    }
];

export const homeRouting: ModuleWithProviders = RouterModule.forChild(homeRoutes);

