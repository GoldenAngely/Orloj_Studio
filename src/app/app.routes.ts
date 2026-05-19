import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AstronomicalClock } from './pages/astronomical-clock/astronomical-clock';

export const routes: Routes = [
{
    path:'',
    component: Home
},
{
    path:'reloj-astronomico',
    component: AstronomicalClock
}


];
