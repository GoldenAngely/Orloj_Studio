import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AstronomicalClock } from './pages/astronomical-clock/astronomical-clock';
import { MappingPractice1 } from './pages/mapping-practice1/mapping-practice1';

export const routes: Routes = [
{
    path:'',
    component: Home
},
{
    path:'reloj-astronomico',
    component: AstronomicalClock
}
,
{
    path:'mapping',
    component: MappingPractice1
}

];
